import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  Param,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Patch,
  ParseUUIDPipe,
  Query,
  UnauthorizedException,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageResponseDto } from 'src/utils/types';
import { TransactionService } from './transaction.service';
import { CreateOrderDto, OrderInitiateDto, TransactionResponseDto } from './transactionDto';

@ApiTags('Transaction')
@Controller('Transaction')
export class TransactionController {
  constructor(private readonly orderService: TransactionService) {}
  @ApiBearerAuth()
  @Put('initite-buy-order')
  @ApiOkResponse({
    description: 'Buy Order Initiated!',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async initiateBuyOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ) {
    await this.orderService.createTransaction(req.user.userId, createOrderDto);
    return new MessageResponseDto('Success', "Order Initiated!")
  }

  @ApiBearerAuth()
  @Get('verify-payment-order')
  @ApiOkResponse({
    description: 'Veriify buy payment order',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async verifyPayment(
    @Query('reference') reference: string,
    @Request() req,
  ) {
    return await this.orderService.verifyPayment(reference, req.user.userId)
  }

  @ApiBearerAuth()
  @Get('user/transactions')
  @ApiOkResponse({
    description: 'get User Transactions',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(
    // @Query('isVe') reference: string,
    @Request() req,
  ) {
    const transactions =  await this.orderService.getUsersTransactions(req.user.userId)
    return transactions.sort((t1, t2) => {
      if(new Date(t1.updatedAt) > new Date(t2.updatedAt)){
        return -1
      }
      return 1
    }).map(t => new TransactionResponseDto(t))
  }

 
}


