import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionCurrency, TransactionType } from 'src/utils/types';

export class CreateOrderDto {

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  bankId?: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

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
  message: boolean;

  @ApiProperty()
  data: OrderData

}
