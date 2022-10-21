import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { UserService } from 'src/user/user.service';
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
} from './transactionDto';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { Web3Wallet } from 'src/web3/wallet';
const polygonRPCProvider = ethers.getDefaultProvider(
  //"https://rpc.ankr.com/polygon"
  'https://rpc-mumbai.maticvigil.com',
);

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly utilService: UtilService,
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
    if (user.banks.length <= 0)
      throw new BadRequestException({
        message: 'Please add a bank before you can make an order',
      });

    // if (!user.isVerified)
    //   throw new BadRequestException({
    //     message: "You can't make an order unless a complete your Kyc",
    //   });

    let order: Transaction;
    if (!crypto) {
      // const bank = user.banks.find((b) => b.bankId === createOrderDto.bankId);
      // if (!bank)
      //   throw new BadRequestException({ message: 'Please Select a Bank' });

      order = this.transactionRepo.create({
        ...createOrderDto,
        user,
      });
      return await this.transactionRepo.save(order);
    }

    order = this.transactionRepo.create({
      ...createOrderDto,
      reference: hash ? hash : '',
      isVerified: true,
      user,
    });
    return await this.transactionRepo.save(order);
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
          polygonRPCProvider,
        );
        await Web3Wallet.sendTransaction(
          wallet,
          [user.wallet.walletAddress, existTrx.tokenAmount.toString()],
          'token',
          'transfer',
          existTrx.tokenAddress,
        );
        await this.editTransaction(existTrx.orderId, { isVerified: true });
        return new MessageResponseDto('Success', 'Funding Succesful');
      }
      return new MessageResponseDto('Error', 'Could not Verify Payment');
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
        this.configService.get('KEY'),
        polygonRPCProvider,
      );
      await Web3Wallet.sendTransaction(
        wallet,
        [user.wallet.walletAddress, existTrx.tokenAmount.toString()],
        'token',
        'transfer',
        existTrx.tokenAddress,
      );
      await this.editTransaction(existTrx.orderId, { isVerified: true });
      return new MessageResponseDto('Success', 'Funding Succesful');
    }
    return new MessageResponseDto('Error', data.message);
  }

  async getUsersTransactions(userId: string, isVerified?: boolean) {
    return await this.transactionRepo.find({
      relations: { bank: true },
      where: { isVerified, user: {userId}},
    });
  }

  async getAllTransaction(isVerified?: boolean) {
    return await this.transactionRepo.find({
      relations: { user: true, bank: true},
      where: { isVerified, },
    });
  }

  async getTransactionByReferenceId(reference: string) {
    return await this.transactionRepo.findOne({
      relations: { user: true },
      where: { reference },
    });
  }

  async editTransaction(orderId: string, editdto: any) {
    const order = await this.transactionRepo.findOneBy({ orderId });
    if (!order) throw new BadRequestException({ message: 'No Order found' });
    await this.transactionRepo.save({ ...order, ...editdto });
  }
}
