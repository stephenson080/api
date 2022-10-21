import { ApiProperty } from '@nestjs/swagger';

export enum Roles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  AGENT = 'AGENT',
}

export class FileUploadDto {
  @ApiProperty({ type: [String], format: 'binary' })
  file: any[];
}
export enum PropertyType {
  MULtINATIONAL = 'MULtINATIONAL',
}

export enum Network {
  POLYGON = 'POLYGON',
  ETHEREUM = 'ETHEREUM',
}

export enum TransactionType {
  BUY_CRYPTO = 'BUY_CRYPTO',
  SELL_CRYPTO = 'SELL_CRYPTO',
  BUY_ASSET = 'BUY_ASSET',
  SELL_ASSET = 'SELL_ASSET',
  SEND_CRYPTO = 'SEND_CRYPTO',
}

export enum TransactionCurrency {
  NAIRA = 'NGN',
  CEDIS = 'GHC',
  DOLLARS = 'USD',
}

export enum  PaymentMethod {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE',
  CRYPTO = 'CRYPTO',
}

export class MessageResponseDto {
  @ApiProperty({ type: String, enum: ['Success', 'Error'] })
  type: string;

  @ApiProperty({ type: String })
  message: string;

  constructor(type: 'Success' | 'Error', message: string) {
    this.message = message;
    this.type = type;
  }
}
