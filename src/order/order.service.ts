import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';
import { UserService } from 'src/user/user.service';
import { UtilService } from 'src/util/util.service';
import { OrderType } from 'src/utils/types';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './orderDto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly userService: UserService,
    private readonly utilService: UtilService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const user = await this.userService.getUserById(userId);
    if (!user)
      throw new UnauthorizedException({
        message: 'You are not Authorised to use this service',
      });
    if (user.banks.length <= 0)
      throw new BadRequestException({
        message: 'Please add a bank before you can make an order',
      });

    const bank = user.banks.find((b) => b.bankId === createOrderDto.bankId);
    if (!bank)
      throw new BadRequestException({ message: 'Please Select a Bank' });
    // if (!user.isVerified)
    //   throw new BadRequestException({
    //     message: "You can't make an order unless a complete your Kyc",
    //   });

    const initOrder = await this.utilService.initiatePaystackPayment(
      user.email,
      createOrderDto.fiatAmount.toString(),
      createOrderDto.currency,
    );
    if (!initOrder.status)
      throw new UnprocessableEntityException({ message: initOrder.message });
    const order = this.orderRepo.create({
      ...createOrderDto,
      authorizationUrl: initOrder.data.authorization_url,
      accessCode: initOrder.data.access_code,
      reference: initOrder.data.reference,
      user,
      bank,
    });

    await this.orderRepo.save(order);
    return initOrder;
  }

  async verifyPaystackPayment(reference: string) {
    return await this.utilService.verifyPaystackPayment(reference);
  }

  async getAllOrders(isVerified?: boolean) {
    return await this.orderRepo.find({
      relations: { user: true },
      where: { isVerified },
    });
  }

  async getOrderByReferenceId(reference: string) {
    return await this.orderRepo.findOne({
      relations: { user: true },
      where: { reference },
    });
  }

  async editOrder(orderId: string, editdto: any) {
    const order = await this.orderRepo.findOneBy({ orderId });
    if (!order) throw new BadRequestException({ message: 'No Order found' });
    await this.orderRepo.save({ ...order, ...editdto });
  }
}
