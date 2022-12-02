import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { User } from 'src/models/user.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import {UserModule} from '../user/user.module'
import { UtilModule } from 'src/util/util.module';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/models/notifications.entity';
import { Walletservice } from 'src/user/wallet.service';
import { Wallet } from 'src/models/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Notification, Wallet]), UserModule, UtilModule],
  controllers: [TransactionController],
  providers: [TransactionService, ConfigService, NotificationService, Walletservice],
  exports: [TransactionService]
})
export class TransactionModule {}
