import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';
import { User } from 'src/models/user.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {UserModule} from '../user/user.module'
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User]), UserModule, UtilModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
