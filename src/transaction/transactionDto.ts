import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionCurrency, TransactionType, PaymentMethod } from 'src/utils/types';

export class CreateOrderDto {

  @ApiProperty({ type: String, required: false })
  bankId?: string;

  @ApiProperty({ type: Number, required: false })
  assetId?: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ type: String, required: false, enum: PaymentMethod })
  @IsString()
  paymentMethod: PaymentMethod;

  @ApiProperty({ type: String, required: false, enum: TransactionCurrency })
  @IsString()
  currency: TransactionCurrency;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  tokenAmount: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  fiatAmount: number;

  @ApiProperty({ type: String, required: false, enum: TransactionType })
  @IsString()
  type: TransactionType;
}

type OrderData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export class OrderInitiateDto {
  @ApiProperty({ type: Boolean })
  status: boolean;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty()
  data: OrderData

}

export class VerifyPaymentDto {
  @ApiProperty({ type: Number, required: true })
  tokenAmount: number;

  @ApiProperty({ type: String, required: true })
  reference: string;

  @ApiProperty({ type: String, required: true })
  tokenAddress: string;

}

export class TransactionResponseDto {
  @ApiProperty({type: String})
  orderId: string

  @ApiProperty({type: String})
  reference: string

  @ApiProperty({type: String})
  tokenAddress: string

  @ApiProperty({type: Number})
  tokenAmount: number

  @ApiProperty({type: Number})
  fiatAmount: number

  @ApiProperty({type: String, enum: TransactionType})
  type: TransactionType

  @ApiProperty({type: String, enum: TransactionCurrency})
  currency: TransactionCurrency

  @ApiProperty({type: String, enum: PaymentMethod})
  paymentMethod: PaymentMethod

  @ApiProperty({type: Boolean})
  isVerified:boolean

  @Exclude()
  isActive: boolean


  @Exclude()
  createdAt: Date

  @ApiProperty({type: String})
  updatedAt: Date


  @ApiProperty({type: String})
  twoFAUri: string

  @ApiProperty()
  bank: any

  @ApiProperty()
  user: any

  constructor(trx: Partial<any>){
      Object.assign(this, trx)
  }
}

