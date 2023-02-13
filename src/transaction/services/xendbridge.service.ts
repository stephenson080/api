import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import { UserService } from 'src/user/services/user.service';
import {
  XendBridgeBuyOrderResponseDto,
  XendBridgeCancelOrderDto,
  XendBridgeOrderDto,
  XendBridgeRateDto,
  XendBridgeRateResponseDto,
  XendBridgeCancelOrderReponseDto
} from '../transactionDto';

import { TransactionService } from './transaction.service';

const XENDBRIDGE_BASE_URL = 'https://canary.xendbridge.com/api';

@Injectable()
export class XendBridgeService {
  xenBridgeApiWithSK: Axios;
  xenBridgeApiWithPK: Axios;
  constructor(
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.xenBridgeApiWithSK = new Axios({
      headers: {
        secretKey: `${this.configService.get('XEND_BRIDGE_SECRET_KEY')}`,
        'Content-Type': 'application/json'
      },
    });
    this.xenBridgeApiWithPK = new Axios({
      headers: {
        publicKey: `${this.configService.get('XEND_BRIDGE_PUBLIC_KEY')}`,
      },
    });
  }

  async getXendbridgeRate(xendBridgeRateDto: XendBridgeRateDto) {
    try {
      const res = await this.xenBridgeApiWithPK.get(
        `${XENDBRIDGE_BASE_URL}/PeerToPeerOrder/Rate?payInCurrencyCode=${xendBridgeRateDto.payInCurrencyCode}&payInCurrencyNetwork=${xendBridgeRateDto.payInCurrencyNetwork}&receiveInCurrencyCode=${xendBridgeRateDto.receiveInCurrencyCode}&receiveInCurrencyNetwork=${xendBridgeRateDto.receiveInCurrencyNetwork}&orderAmount=${xendBridgeRateDto.orderAmount}`,
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const data: XendBridgeRateResponseDto = JSON.parse(res.data);
      return data;
    } catch (err) {
      throw err;
    }
  }

  async xendBridgeBuyOrder(userId: string, orderDto: XendBridgeOrderDto) {
    try {
      const user = await this.userService.getUserById(userId, true, true);
      if (!user) throw new UnauthorizedException({ message: 'Not Authorised' });
      if (!user.wallet)
        throw new BadRequestException({
          message: "Sorry You don't have a wallet to perform transaction",
        });
      if (user.banks.length <= 0)
        throw new BadRequestException({
          message: 'Please add a bank to perform transaction',
        });
      const _bank = user.banks.find((b) => b.bankId === orderDto.bankId);
      if (!_bank) throw new BadRequestException({ message: 'No Bank found' });

      const body = {
        emailAddress: user.email,
        phoneNumber: '07064366723',
        userName: user.person.fullName,
        payInCurrencyCode: orderDto.payInCurrencyCode,
        payInCurrencyNetwork: orderDto.payInCurrencyNetwork,
        receiveInCurrencyCode: orderDto.receiveInCurrencyCode,
        receiveInCurrencyNetwork: orderDto.receiveInCurrencyNetwork,
        orderAmount: orderDto.orderAmount,
        consumerDepositMethod: {
          paymentMethod: orderDto.paymentMethod,
          paymentData: {
            accountName: _bank.accountName,
            accountNumber: _bank.accountNumber,
            bankName: _bank.bankName,
          },
        },
        consumerReceiptMethod: {
          paymentMethod: 'Crypto',
          paymentData: {
            walletAddress: user.wallet.walletAddress,
            network: 'POLYGON',
          },
        },
      };
      const res = await this.xenBridgeApiWithSK.post(
        `${XENDBRIDGE_BASE_URL}/peertopeerorder/buy/initiate`,
        JSON.stringify({...body}),
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const data: XendBridgeBuyOrderResponseDto = JSON.parse(res.data);
      return data
    } catch (err) {
      throw new UnprocessableEntityException({message: 'Some went wrong'});
    }
  }

  async cancelXendBridgeOrder(userId: string, xendBridgeCancelOrderDto : XendBridgeCancelOrderDto){
    try {
      const user = await this.userService.getUserById(userId, true, true);
      if (!user) throw new UnauthorizedException({ message: 'Not Authorised' });
      const res = await this.xenBridgeApiWithSK.post(
        `${XENDBRIDGE_BASE_URL}/PeerToPeerOrder/ThirdParty/Order/Cancel`,
        JSON.stringify({...xendBridgeCancelOrderDto}),
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const data : XendBridgeCancelOrderReponseDto = JSON.parse(res.data)
      return data
    }catch (err){
      throw new UnprocessableEntityException({message: 'Some went wrong'});
    }
  }
}
