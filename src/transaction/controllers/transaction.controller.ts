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
import { Any } from 'typeorm';
import { TransactionService } from '../services/transaction.service';
import { XendBridgeService } from '../services/xendbridge.service';
import {
  CreateOrderDto,
  OrderInitiateDto,
  TransactionResponseDto,
  XendBridgeRateDto,
  XendBridgeRateResponseDto,
  XendBridgeOrderDto,
  XendBridgeCancelOrderDto,
  XendBridgeBuyOrderResponseDto,
  XendBridgeCancelOrderReponseDto
} from '../transactionDto';

@ApiTags('Transaction')
@Controller('Transaction')
export class TransactionController {
  constructor(
    private readonly orderService: TransactionService,
    private readonly xendBridgeService: XendBridgeService,
  ) {}
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
    return new MessageResponseDto('Success', 'Order Initiated!');
  }

  @ApiBearerAuth()
  @Get('verify-payment-order')
  @ApiOkResponse({
    description: 'Veriify buy payment order',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async verifyPayment(@Query('reference') reference: string, @Request() req) {
    return await this.orderService.verifyPayment(reference, req.user.userId);
  }

  @ApiBearerAuth()
  @Get('user/transactions')
  @ApiOkResponse({
    description: 'get User Transactions',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@Request() req) {
    const transactions = await this.orderService.getUsersTransactions(
      req.user.userId,
    );
    return transactions
      .sort((t1, t2) => {
        if (new Date(t1.updatedAt) > new Date(t2.updatedAt)) {
          return -1;
        }
        return 1;
      })
      .map((t) => new TransactionResponseDto(t));
  }

  // xendbridge endpoints
  @Get('xendbridge/rate')
  @ApiOkResponse({
    description: 'get Xendbridge rate',
    type: XendBridgeRateResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  async getRate(
    @Query('orderAmount') orderAmount: number,
    @Query('receiveInCurrencyNetwork') receiveInCurrencyNetwork: string,
    @Query('payInCurrencyCode') payInCurrencyCode: string,
    @Query('payInCurrencyNetwork') payInCurrencyNetwork: string,
    @Query('receiveInCurrencyCode') receiveInCurrencyCode: string,
  ) {
    const xendBridgeRateDto: XendBridgeRateDto = {
      orderAmount,
      payInCurrencyCode,
      payInCurrencyNetwork,
      receiveInCurrencyCode,
      receiveInCurrencyNetwork,
    };
    return await this.xendBridgeService.getXendbridgeRate(xendBridgeRateDto);
  }

  @ApiBearerAuth()
  @Post('xendbridge/initiate-order')
  @ApiOkResponse({
    description: 'Initiate Xendbrigde Order',
    type: XendBridgeBuyOrderResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async initXendBridgeOrder(@Request() req, @Body() orderDto: XendBridgeOrderDto) {
    if (!req.user) throw new UnauthorizedException({message: 'Not authorised'})
    return await this.xendBridgeService.xendBridgeBuyOrder(req.user.userId, orderDto)
  }

  @ApiBearerAuth()
  @Post('xendbridge/cancel-order')
  @ApiOkResponse({
    description: 'Cancel Xendbrigde Order',
    type: XendBridgeCancelOrderReponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async cancelXendBridgeOrder(@Request() req, @Body() cancelOrderDto :XendBridgeCancelOrderDto) {
    if (!req.user) throw new UnauthorizedException({message: 'Not authorised'})
    return await this.xendBridgeService.cancelXendBridgeOrder(req.user.userId, cancelOrderDto)
  }
}
