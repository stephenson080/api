import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderCurrency, OrderType } from 'src/utils/types';

export class CreateOrderDto {

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  bankId: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty({ type: String, required: false, enum: OrderCurrency })
  @IsString()
  currency: OrderCurrency;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  tokenAmount: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  fiatAmount: number;

  @ApiProperty({ type: String, required: false, enum: OrderType })
  @IsString()
  type: OrderType;
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
