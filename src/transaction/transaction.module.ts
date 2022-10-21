import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { User } from 'src/models/user.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import {UserModule} from '../user/user.module'
import { UtilModule } from 'src/util/util.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User]), UserModule, UtilModule],
  controllers: [TransactionController],
  providers: [TransactionService, ConfigService],
  exports: [TransactionService]
})
export class TransactionModule {}
