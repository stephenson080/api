import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/models/person.entity';
import { User } from 'src/models/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PersonModule } from 'src/person/person.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
// import { LocalStrategy } from 'src/auth/local.stratefy';
import { UtilService } from 'src/util/util.service';
import { ConfigService } from '@nestjs/config';
import { Walletservice } from './wallet.service';
import { Wallet } from 'src/models/wallet.entity';
import { Transaction } from 'src/models/transaction.entity';
import { Bank } from 'src/models/bank.entity';
// import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { Property } from 'src/models/property.entity';
import { PropertyService } from 'src/property/property.service';
import { PropertyDetail } from 'src/models/propertyDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Person, Wallet, Transaction, Bank, Property, PropertyDetail]),
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
    PropertyService
  ],
  exports: [UserService, Walletservice,  ],
})
export class UserModule {}
