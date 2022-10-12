import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import {v2 as cloudinary} from 'cloudinary'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './models/person.entity';
import { User } from './models/user.entity';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UtilModule } from './util/util.module';

import { PropertyModule } from './property/property.module';
import { Property } from './models/property.entity';
import { PropertyDetail } from './models/propertyDetail.entity';
import { Wallet } from './models/wallet.entity';
import { Bank } from './models/bank.entity';
import { Transaction } from './models/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';



// production Connection

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Person, User, Property, PropertyDetail, Wallet, Bank, Transaction],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UserModule,
    UtilModule,
    PropertyModule,
     TransactionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
// Development Connnection

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({

//         type: 'postgres',
//         host: configService.get('DB_HOST'),
//         port: +configService.get<number>('DB_PORT'),
//         username: configService.get('DB_USERNAME'),
//         password: configService.get('DB_PASSWORD'),
//         database: configService.get('DB_NAME'),
//         entities: [User, Person, Property, PropertyDetail, Wallet, Bank, Transaction],
//         synchronize: true
//       }),
//       inject: [ConfigService],
//     }),
//     UserModule,
//     UtilModule,
//     PropertyModule,
//     TransactionModule,

//   ],
//   controllers: [],
//   providers: [{
//     provide: APP_INTERCEPTOR,
//     useClass: ClassSerializerInterceptor
//   }],
// })
export class AppModule {}
