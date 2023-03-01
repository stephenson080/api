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
  XendBridgeCancelOrderReponseDto,
  ConfirmXendBridgeOrderDto,
  LpConfirmXendBridgeOrderDto,
  XendBridgeSellOrderResponseDto,
  XendBridgePendingOrderResponseDto,
  XB_Bank,
  Xb_Wallet,
  XendBridgeConfirmOrderReponseDto,
} from '../transactionDto';

import {
  PaymentMethod,
  TransactionCurrency,
  TransactionType,
} from 'src/utils/types';

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
        'Content-Type': 'application/json',
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
        JSON.stringify({ ...body }),
      );
      if (!res.data || !(JSON.parse(res.data)).data) {
        throw new BadRequestException({ message: (JSON.parse(res.data)).Message || res.statusText || 'Could not initiate Order' });
      }
      const data: XendBridgeBuyOrderResponseDto = JSON.parse(res.data)
      if (!data.data) {
        const data : any = JSON.parse(res.data);
        return {
          status: data.Status,
          message: data.Message,
          data: data.Data
        }
      }
      await this.transactionService.createTransaction(user.userId, {
        currency: this.getTransactionCurrency(orderDto.payInCurrencyCode),
        fiatAmount: data.data.payableAmount,
        paymentMethod: PaymentMethod.BANK,
        reference: data.data.orderReference,
        tokenAddress: this.getTokenAddress(orderDto.receiveInCurrencyCode),
        tokenAmount: Math.floor(data.data.receivableAmount),
        type: TransactionType.BUY_CRYPTO,
        bankId: orderDto.bankId,
      });
      return data
    } catch (err) {
      throw new UnprocessableEntityException({ message: err.message });
    }
  }
  private getTransactionCurrency(currency: string) {
    switch (currency) {
      case 'NGN':
        return TransactionCurrency.NAIRA;
      case 'GHC':
        return TransactionCurrency.CEDIS;
      case 'USD':
        return TransactionCurrency.DOLLARS;
      case 'USDT' || 'USDC' || 'BUSD':
        return TransactionCurrency.CRYPTO;
      default:
        return TransactionCurrency.NAIRA;
    }
  }

  private getTokenAddress(tokenName: string) {
    switch (tokenName) {
      case 'USDT':
        return '0xE071280a687053be56E71aa777436b167b35C7fc';
      default:
        return '0xE071280a687053be56E71aa777436b167b35C7fc';
    }
  }
  async xendBridgeSellOrder(userId: string, orderDto: XendBridgeOrderDto) {
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
            walletAddress: user.wallet.walletAddress,
            network: 'POLYGON',
          },
        },
        consumerReceiptMethod: {
          paymentMethod: orderDto.recieveMethod,
          paymentData: {
            accountName: _bank.accountName,
            accountNumber: _bank.accountNumber,
            bankName: _bank.bankName,
          },
        },
      };
      const res = await this.xenBridgeApiWithSK.post(
        `${XENDBRIDGE_BASE_URL}/peertopeerorder/sell/initiate`,
        JSON.stringify({ ...body }),
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const data: XendBridgeSellOrderResponseDto = JSON.parse(res.data);
      if (!data.data) {
        const data : any = JSON.parse(res.data);
        return {
          status: data.Status,
          message: data.Message,
          data: data.Data
        }
      }
      
      await this.transactionService.createTransaction(user.userId, {
        currency: this.getTransactionCurrency(orderDto.payInCurrencyCode),
        fiatAmount: data.data.receivableAmount,
        paymentMethod: PaymentMethod.CRYPTO,
        reference: data.data.orderReference,
        tokenAddress: this.getTokenAddress(orderDto.payInCurrencyCode),
        tokenAmount: data.data.payableAmount,
        type: TransactionType.SELL_CRYPTO,
        bankId: orderDto.bankId,
      });
      return data
    } catch (err) {
      throw new UnprocessableEntityException({ message: err.message });
    }
  }

  async cancelXendBridgeOrder(
    userId: string,
    xendBridgeCancelOrderDto: XendBridgeCancelOrderDto,
  ) {
    try {
      const user = await this.userService.getUserById(userId, true, true);
      if (!user) throw new UnauthorizedException({ message: 'Not Authorised' });
      const res = await this.xenBridgeApiWithSK.post(
        `${XENDBRIDGE_BASE_URL}/PeerToPeerOrder/ThirdParty/Order/Cancel`,
        JSON.stringify({ ...xendBridgeCancelOrderDto }),
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const data: XendBridgeCancelOrderReponseDto = JSON.parse(res.data);
      return data;
    } catch (err) {
      throw new UnprocessableEntityException({ message: err.message });
    }
  }

  async getXendBridgePendingOrder(userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) throw new UnauthorizedException({ message: 'Not Authorised' });
      const res = await this.xenBridgeApiWithSK.get(
        `${XENDBRIDGE_BASE_URL}/PeerToPeerOrder/ThirdParty/PendingOrder?emailAddress=${user.email}`,
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const _data = JSON.parse(res.data);
      if (!_data.data.orderResponse) {
        throw new Error('No Pending Order')
      }
      if (_data.data.orderResponse.orderType === 'Sell') {
        const data: XendBridgePendingOrderResponseDto<Xb_Wallet> = _data;
        return data;
      }
      const data: XendBridgePendingOrderResponseDto<XB_Bank> = _data;
      return data;
    } catch (err) {
      throw new UnprocessableEntityException({ message: err.message });
    }
  }

  async userConfirmXendBridgeOrder(
    userId: string,
    xendBridgeConfirmOrderDto: ConfirmXendBridgeOrderDto,
  ) {
    try {
      const user = await this.userService.getUserById(userId, true, true);
      if (!user) throw new UnauthorizedException({ message: 'Not Authorised' });
      const res = await this.xenBridgeApiWithSK.post(
        `${XENDBRIDGE_BASE_URL}/PeerToPeerOrder/ThirdParty/Order/Confirm`,
        JSON.stringify({ ...xendBridgeConfirmOrderDto }),
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const data: XendBridgeConfirmOrderReponseDto = JSON.parse(res.data);
      return data;
    } catch (err) {
      throw new UnprocessableEntityException({ message: err.message });
    }
  }

  async LpConfirmXendBridgeOrder(
    userId: string,
    xendBridgeLpConfirmOrderDto: LpConfirmXendBridgeOrderDto,
  ) {
    try {
      const user = await this.userService.getUserById(userId, true, true);
      if (!user) throw new UnauthorizedException({ message: 'Not Authorised' });
      let url = '/LPSimulation/Order/Receipt';
      if (xendBridgeLpConfirmOrderDto.transactionHash) {
        url = '/LPSimulation/Order/Confirm';
      }
      const res = await this.xenBridgeApiWithSK.post(
        `${XENDBRIDGE_BASE_URL}${url}`,
        JSON.stringify({ ...xendBridgeLpConfirmOrderDto }),
      );
      if (!res.data) {
        throw new BadRequestException({ message: res.statusText });
      }
      const data: XendBridgeConfirmOrderReponseDto = JSON.parse(res.data);
      return data;
    } catch (err) {
      throw new UnprocessableEntityException({ message: err.message });
    }
  }
}
