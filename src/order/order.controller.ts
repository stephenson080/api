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
import { OrderService } from './order.service';
import { CreateOrderDto, OrderInitiateDto } from './orderDto';

@ApiTags('Order')
@Controller('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @ApiBearerAuth()
  @Put('initite-buy-order')
  @ApiOkResponse({
    description: 'Buy Order Initiated!',
    type: OrderInitiateDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async initiateBuyOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ) {
    return await this.orderService.createOrder(req.user.userId, createOrderDto);
  }

  @ApiBearerAuth()
  @Get('verify-buy-order/:reference')
  @ApiOkResponse({
    description: 'Veriify buy payment order',
    type: OrderInitiateDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  async verifyPaystackPayment(
    @Param('reference') reference: string,
    @Request() req,
  ) {
    return await this.orderService.verifyPaystackPayment(reference)
    
  }
}
