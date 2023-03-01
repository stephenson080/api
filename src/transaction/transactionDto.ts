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
import { Any } from 'typeorm';
import { formatDate } from 'src/utils/helpers';

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

  @ApiProperty()
  bank: any

  @ApiProperty()
  user: any

  constructor(trx: Partial<any>){
      Object.assign(this, trx)
  }
}

export class XendBridgeRateDto {
  @ApiProperty({ type: Number, required: true })
  orderAmount: number;

  @ApiProperty({ type: String, required: true })
  receiveInCurrencyNetwork: string;

  @ApiProperty({ type: String, required: true })
  payInCurrencyCode: string;

  @ApiProperty({ type: String, required: true })
  payInCurrencyNetwork: string;

  @ApiProperty({ type: String, required: true })
  receiveInCurrencyCode: string;

}

interface XBRateData  {
  exchangeRate: number
  maximumAmount: number
  minimumAmount: number
  rateValidityInSeconds: number
}

export interface XB_Bank {
  bankName: string,
  accountNumber: string,
  accountName: string,
  address: string,
  swiftCode: string,
  iban: string,
  sortCode: string,
  currency: string,
  network: string
}

export interface Xb_Wallet {
  walletAddress: string
  network: string
  currency: string
}
interface XBBuyOrderData  {
  orderReference: string
  payableAmount: number
  receivableAmount: number
  orderExpiryDate: string
  providerPaymentMethods: {
    paymentMethod: string,
    paymentType: string,
    paymentData:  XB_Bank[],
    orderPaymentMethod: XB_Bank
  },
}
interface XBSellOrderData  {
  orderReference: string
  receivableAmount: number
  payableAmount: number
  orderExpiryDate: string
  providerPaymentMethods: {
    paymentMethod: string,
    paymentType: string,
    paymentData:  Xb_Wallet[],
    orderPaymentMethod: Xb_Wallet
  },
}

interface XBPendingOrderData<T>  {
  orderReference: string
  receivableAmount: number
  orderExpiryDate: string
  orderType: string
  providerPaymentMethods: {
    paymentMethod: string,
    paymentType: string,
    paymentData:  T[],
    orderPaymentMethod: T
  },
}
export class XendBridgeRateResponseDto {
  @ApiProperty({ type: Any })
  data: XBRateData;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  status: string;
}

export class XendBridgeOrderDto {
  @ApiProperty({ type: Number, required: true })
  orderAmount: number;

  @ApiProperty({ type: String, required: true })
  receiveInCurrencyCode: string;
  @ApiProperty({ type: String, required: true })
  receiveInCurrencyNetwork: string;
  @ApiProperty({ type: String, required: true })
  payInCurrencyNetwork: string;
  @ApiProperty({ type: String, required: true })
  payInCurrencyCode: string;
  @ApiProperty({ type: String, required: true })
  bankId: string;
  @ApiProperty({ type: String, required: true })
  paymentMethod: string;
  @ApiProperty({ type: String, required: true })
  recieveMethod: string;
}

export class XendBridgeBuyOrderResponseDto {
  @ApiProperty({ type: String, required: true })
  status: string;
  @ApiProperty({ type: String, required: true })
  message: string;
  @ApiProperty({ type: Any, required: true })
  data: XBBuyOrderData;
  
}

export class XendBridgeSellOrderResponseDto {
  @ApiProperty({ type: String, required: true })
  status: string;
  @ApiProperty({ type: String, required: true })
  message: string;
  @ApiProperty({ type: Any, required: true })
  data: XBSellOrderData;
  
}
export class XendBridgePendingOrderResponseDto<T> {
  @ApiProperty({ type: Any })
  data: {
    orderResponse: XBPendingOrderData<T>
  }

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  status: string;
}
export class XendBridgeCancelOrderDto {
  @ApiProperty({ type: String, required: true })
  emailAddress: string;
  @ApiProperty({ type: String, required: true })
  orderReference: string;  
}

export class ConfirmXendBridgeOrderDto {
  @ApiProperty({ type: String, required: true })
  emailAddress: string;
  @ApiProperty({ type: String, required: true })
  orderReference: string;
  @ApiProperty({ type: String, required: false })
  transactionHash?: string;  
}

export class LpConfirmXendBridgeOrderDto {
  @ApiProperty({ type: String, required: true })
  orderReference: string;
  @ApiProperty({ type: String, required: false })
  paymentNetwork?: string;
  @ApiProperty({ type: String, required: false })
  transactionHash?: string;  
}

export class XendBridgeCancelOrderReponseDto {
  @ApiProperty({ type: String, required: true })
  status: string;
  @ApiProperty({ type: String, required: true })
  message: string;
  
  @ApiProperty({ type: Boolean, required: true })
  data: boolean;
}

export class XendBridgeConfirmOrderReponseDto {
  @ApiProperty({ type: String })
  status: string;
  @ApiProperty({ type: String })
  message: string;
  
  @ApiProperty({ type: Boolean })
  data: boolean;
}

