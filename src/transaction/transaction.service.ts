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
import { TransactionType } from 'src/utils/types';
import { Repository } from 'typeorm';
import { CreateOrderDto, OrderInitiateDto } from './transactionDto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly userService: UserService,
    private readonly utilService: UtilService,
  ) {}

  async createTransaction(
    userId: string,
    createOrderDto: CreateOrderDto,
    crypto?: boolean,
    hash?: string
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
    let initOrder : OrderInitiateDto
    if (!crypto) {
      const bank = user.banks.find((b) => b.bankId === createOrderDto.bankId);
      if (!bank)
        throw new BadRequestException({ message: 'Please Select a Bank' });
      initOrder = await this.utilService.initiatePaystackPayment(
        user.email,
        createOrderDto.fiatAmount.toString(),
        createOrderDto.currency,
      );
      if (!initOrder.status)
        throw new UnprocessableEntityException({ message: initOrder.message });
      order = this.transactionRepo.create({
        ...createOrderDto,
        authorizationUrl: initOrder.data.authorization_url,
        accessCode: initOrder.data.access_code,
        reference: initOrder.data.reference,
        user,
        bank,
      });
    }

    order = this.transactionRepo.create({
      ...createOrderDto,
      reference: hash ? hash : '',
      user,
    });
    await this.transactionRepo.save(order);
    return crypto ? order : initOrder
  }

  async verifyPaystackPayment(reference: string) {
    return await this.utilService.verifyPaystackPayment(reference);
  }

  async getAllTransaction(isVerified?: boolean) {
    return await this.transactionRepo.find({
      relations: { user: true },
      where: { isVerified },
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
