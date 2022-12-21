import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';


import { UserController } from './user.controller';

import { PersonModule } from 'src/person/person.module';

import { JwtStrategy } from 'src/auth/jwt.strategy';

// import { LocalStrategy } from 'src/auth/local.stratefy';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';
import { Walletservice } from './services/wallet.service';
import { NotificationService } from 'src/notification/notification.service';
import { PropertyService } from 'src/property/property.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './services/user.service';
import { WaitListService } from './services/waitlist.service';

import { Wallet } from 'src/models/wallet.entity';
import { Transaction } from 'src/models/transaction.entity';
import { Bank } from 'src/models/bank.entity';
import { Property } from 'src/models/property.entity';
import { PropertyDetail } from 'src/models/propertyDetail.entity';
import { Notification } from 'src/models/notifications.entity';
import { WaitList } from 'src/models/waitlist.entity';
import { Person } from 'src/models/person.entity';
import { User } from 'src/models/user.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([User, Person, Wallet, Transaction, Bank, Property, PropertyDetail, Notification, WaitList]),
    PersonModule,
    JwtModule,
    // TransactionModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    ConfigService,
    UtilService,
    Walletservice,
    TransactionService,
    PropertyService,
    NotificationService,
    WaitListService
  ],
  exports: [UserService, Walletservice,  ],
})
export class UserModule {}
