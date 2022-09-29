import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
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
import { Order } from 'src/models/order.entity';
import { Bank } from 'src/models/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Person, Wallet, Order, Bank]), PersonModule, JwtModule],
  controllers: [UserController],
  providers: [UserService,AuthService, JwtStrategy, ConfigService, UtilService, Walletservice] ,
  exports: [UserService, Walletservice]
})
export class UserModule {}
