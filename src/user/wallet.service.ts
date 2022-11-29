import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Wallet } from 'src/models/wallet.entity';
import { CreateOrderDto } from 'src/transaction/transactionDto';
import {
  PaymentMethod,
  TransactionCurrency,
  TransactionType,
} from 'src/utils/types';
import { Web3Wallet } from 'src/web3/wallet';
import { Repository } from 'typeorm';
import {addresses} from '../web3/util/abi'

@Injectable()
export class Walletservice {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
  ) {}
  async getwallet(id?: string, address?: string){
    return await this.walletRepo.findOneBy({walletId: id, walletAddress: address})
  }
  async createWallet(passcode: string) {
    const newWallet = await Web3Wallet.createWallet(passcode);
    const wallet = this.walletRepo.create({
      passwordEncryptedWallet: newWallet.passwordEncryptedWallet,
      walletAddress: newWallet.address,
      staticEncryptedWallet: newWallet.staticEncryptedWallet,
      salt: newWallet.salt,
    });
    return await this.walletRepo.save(wallet);
  }

  async customWallet(walletAddress: string) {
    const wallet = this.walletRepo.create({ walletAddress });
    return await this.walletRepo.save(wallet);
  }

  async decryptWallet(
    passcode: string,
    salt: string,
    encryptedWalletJson: string,
  ) {
    return await Web3Wallet.decryptWallet(passcode, encryptedWalletJson, salt);
  }

  async resetUserWallet(
    walletId: string,
    salt: string,
    staticEncryptedWallet: string,
    newPassword: string,
  ) {
    const wallet = await this.walletRepo.findOneBy({ walletId });
    if (!wallet)
      throw new BadRequestException({
        message:
          'No Wallet Found!. Please try again. If Problem persist contact support',
      });
    const newPasswordEncryptedJson = await Web3Wallet.resetWalletWithsalt(
      staticEncryptedWallet,
      salt,
      newPassword,
    );
    return await this.walletRepo.save({
      ...wallet,
      passwordEncryptedWallet: newPasswordEncryptedJson,
    });
  }

  async sendWalletTransaction(
    wallet: Wallet,
    password: string,
    params: any[],
    contract: 'token' | 'initialSale' | 'blockplot' | 'swap',
    contractFunction: string,
    contractAddress: string,
  ) {
    try {
      const ethersWallet = await this.decryptWallet(
        password,
        wallet.salt,
        wallet.passwordEncryptedWallet,
      );
      if (!ethersWallet)
        throw new BadRequestException({
          message: 'OPPs! Seems your password is incorrect. try again',
        });
      if (contract === 'initialSale') {
        await Web3Wallet.sendTransaction(
          ethersWallet,
          [contractAddress, ethers.constants.MaxUint256],
          'token',
          'approve',
          params[0],
        );
        const transaction = await Web3Wallet.sendTransaction(
          ethersWallet,
          [params[0], params[1], ethers.utils.parseEther(params[2])],
          contract,
          contractFunction,
          contractAddress,
        );
        Web3Wallet.sendTransaction(
          ethersWallet,
          [contractAddress, '0'],
          'token',
          'approve',
          params[0],
        );
        const createTransactionDto: CreateOrderDto = {
          reference: transaction.hash,
          currency: TransactionCurrency.DOLLARS,
          fiatAmount: +ethers.utils.formatUnits(params[2], 'wei') * 600,
          tokenAddress: params[0],
          tokenAmount: +ethers.utils.formatUnits(params[2], 'wei'),
          type: TransactionType.BUY_ASSET,
          paymentMethod: PaymentMethod.CRYPTO,
          assetId: params[1]
        };
        return {
          createTransactionDto,
          reference: transaction.hash,
        };
      }
      if (contract === 'swap') {
        if (!params[3]) {
          await Web3Wallet.sendTransaction(
            ethersWallet,
            [contractAddress, ethers.constants.MaxUint256],
            'token',
            'approve',
            params[1],
          );
          const transaction = await Web3Wallet.sendTransaction(
            ethersWallet,
            [params[0], params[1], ethers.utils.parseEther(params[2]), params[3]],
            contract,
            contractFunction,
            contractAddress,
          );
          Web3Wallet.sendTransaction(
            ethersWallet,
            [contractAddress, '0'],
            'token',
            'approve',
            params[1],
          );
          const createTransactionDto: CreateOrderDto = {
            reference: transaction.hash,
            currency: TransactionCurrency.DOLLARS,
            fiatAmount: +ethers.utils.formatUnits(params[2], 'wei') * 600,
            
            tokenAddress: params[1],
            tokenAmount: +ethers.utils.formatUnits(params[2], 'wei'),
            type: TransactionType.BUY_ASSET,
            paymentMethod: PaymentMethod.CRYPTO,
            assetId: params[0]
          };
          return {
            createTransactionDto,
            reference: transaction.hash,
          };
        }
        await Web3Wallet.sendTransaction(
          ethersWallet,
          [contractAddress, true],
          'blockplot',
          'setApprovalForAll',
          addresses.blockplot,
        );
        const transaction = await Web3Wallet.sendTransaction(
          ethersWallet,
          [params[0], params[1], ethers.utils.parseEther(params[2]), true],
          contract,
          contractFunction,
          contractAddress,
        );
        Web3Wallet.sendTransaction(
          ethersWallet,
          [contractAddress, false],
          'blockplot',
          'setApprovalForAll',
          addresses.blockplot,
        );
        const createTransactionDto: CreateOrderDto = {
          reference: transaction.hash,
          currency: TransactionCurrency.DOLLARS,
          fiatAmount: +ethers.utils.formatUnits(params[2], 'wei') * 600,
          
          tokenAddress: params[1],
          tokenAmount: +ethers.utils.formatUnits(params[2], 'wei'),
          type: TransactionType.SELL_ASSET,
          paymentMethod: PaymentMethod.CRYPTO,
          assetId: params[0]
        };
        return {
          createTransactionDto,
          reference: transaction.hash,
        };

        
      }

      
      const transaction = await Web3Wallet.sendTransaction(
        ethersWallet,
        params,
        contract,
        contractFunction,
        contractAddress,
      );
      const amount = ethers.utils.formatEther(params[1]);
      const createTransactionDto: CreateOrderDto = {
        currency: TransactionCurrency.DOLLARS,
        fiatAmount: +amount * 600,
        tokenAddress: contractAddress,
        tokenAmount: +amount,
        type: TransactionType.SEND_CRYPTO,
        paymentMethod: PaymentMethod.CRYPTO,
        reference: transaction.hash,
      };
      return {
        createTransactionDto,
        reference: transaction.hash,
      };
    } catch (error) {
      // if (error.message.length > 200) throw new UnprocessableEntityException({message: 'Something went wrong. Try Agin. If it persist Contact Support'})

      throw new UnprocessableEntityException({ message: error.message });
    }
  }
}
