import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { UserService } from 'src/user/services/user.service';
import { UtilService } from 'src/util/util.service';
import {
  TransactionType,
  PaymentMethod,
  MessageResponseDto,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import {
  CreateOrderDto,
  OrderInitiateDto,
  VerifyPaymentDto,
} from '../transactionDto';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { Web3Wallet } from 'src/web3/wallet';
import { NotificationService } from 'src/notification/notification.service';
import { provider } from '../../web3/util/constants';
import { Walletservice } from 'src/user/services/wallet.service';
// const polygonRPCProvider = ethers.getDefaultProvider(
//   //"https://rpc.ankr.com/polygon"
//   'https://rpc-mumbai.maticvigil.com',
// );

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly utilService: UtilService,
    private readonly walletService: Walletservice,
  ) {}

  async createTransaction(
    userId: string,
    createOrderDto: CreateOrderDto,
    crypto?: boolean,
    hash?: string,
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user)
      throw new UnauthorizedException({
        message: 'You are not Authorised to use this service',
      });

    if (!user.isVerified)
      throw new BadRequestException({
        message: 'Please Complete your Kyc before you can use this Service',
      });
    if (user.banks.length <= 0)
      throw new BadRequestException({
        message: 'Please add a bank before you can make an order',
      });
    let order: Transaction;
    if (!crypto) {
      const bank = user.banks.find((b) => b.bankId === createOrderDto.bankId);
      if (!bank)
        throw new BadRequestException({ message: 'Please Select a Bank' });

      order = this.transactionRepo.create({
        ...createOrderDto,
        user,
        bank
      });
      return await this.transactionRepo.save({
        ...order,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    order = this.transactionRepo.create({
      ...createOrderDto,
      reference: hash ? hash : '',
      isVerified: true,
      user,
    });
    return await this.transactionRepo.save({
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async verifyPayment(reference: string, userId: string) {
    const user = await this.userService.getUserById(userId, undefined, true);
    if (!user.wallet)
      throw new BadRequestException({
        message: 'No Wallet found to send Funds',
      });
    const existTrx = await this.transactionRepo.findOneBy({
      reference: reference,
    });
    if (!existTrx)
      throw new BadRequestException({ message: 'No Transaction Found' });
    if (existTrx.paymentMethod === PaymentMethod.FLUTTERWAVE) {
      const data = await this.utilService.verifyFlutterwavePayment(
        existTrx.reference,
      );
      if (data.status === 'success') {
        if (existTrx.isVerified)
          throw new BadRequestException({
            message: 'Transaction Already completed!',
          });
        const wallet = new ethers.Wallet(
          this.configService.get('KEY'),
          provider,
        );
        await Web3Wallet.sendTransaction(
          wallet,
          [user.wallet.walletAddress, existTrx.tokenAmount.toString()],
          'token',
          'transfer',
          existTrx.tokenAddress,
        );
        await this.notificationService.createNotification(user.userId, {
          body: 'You just successfully funded your wallet. Check out the wallet screen to view the transaction details',
          title: 'Wallet Funding Successful',
        });
        await this.editTransaction(existTrx.orderId, { isVerified: true });
        this.userService.editUser(user.userId, { fundWallet: true });
        if (user.wallet && user.wallet.walletAddress) {
          this.walletService.sendUserSomeNativeToken(user.wallet.walletAddress);
        }
        const notifications =
          await this.notificationService.getUsersNotifications(user.userId);
        const msg = new MessageResponseDto('Success', `Transaction Successful`);
        return {
          message: msg,
          notifications: notifications
        };
      }
      throw new UnprocessableEntityException({
        message: 'Could not Verify Payment',
      });
    }

    const data = await this.utilService.verifyPaystackPayment(
      existTrx.reference,
    );
    if (data.status) {
      if (existTrx.isVerified)
        throw new BadRequestException({
          message: 'Transaction Already completed!',
        });
      const wallet = new ethers.Wallet(
        this.configService.get('KEY2'),
        provider,
      );
      await Web3Wallet.sendTransaction(
        wallet,
        [user.wallet.walletAddress, existTrx.tokenAmount.toString()],
        'token',
        'transfer',
        existTrx.tokenAddress,
      );
      await this.notificationService.createNotification(user.userId, {
        body: 'You just successfully funded your wallet. Check out the wallet screen to view the transaction details',
        title: 'Wallet Funding Successful',
      });
      await this.editTransaction(existTrx.orderId, { isVerified: true });
      this.userService.editUser(user.userId, { fundWallet: true });
      if (user.wallet && user.wallet.walletAddress) {
        this.walletService.sendUserSomeNativeToken(user.wallet.walletAddress);
      }
      const notifications =
        await this.notificationService.getUsersNotifications(user.userId);
      const msg = new MessageResponseDto('Success', `Transaction Successful`);
      return {
        message: msg,
        notifications: notifications
      };
    }
    throw new UnprocessableEntityException({
      message: 'Could not Verify Payment',
    });
  }

  async getUsersTransactions(userId: string, isVerified?: boolean) {
    return await this.transactionRepo.find({
      relations: { bank: true },
      where: { isVerified, user: { userId } }, order: {createdAt: {direction: 'ASC'}},
    });
  }

  async getAllTransaction(isVerified?: boolean) {
    return await this.transactionRepo.find({
      relations: { user: true, bank: true },
      where: { isVerified }, order: {createdAt: {direction: 'ASC'}},
    });
  }

  async getTransactionByReferenceId(reference: string) {
    return await this.transactionRepo.findOne({
      relations: { user: true, },
      where: { reference },
    });
  }

  async editTransaction(orderId: string, editdto: any) {
    const order = await this.transactionRepo.findOneBy({ orderId });
    if (!order) throw new BadRequestException({ message: 'No Order found' });
    editdto.updatedAt = new Date()
    await this.transactionRepo.save({ ...order, ...editdto });
  }
}
