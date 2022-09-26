import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Wallet } from 'src/models/wallet.entity';
import { Web3Wallet } from 'src/web3/wallet';
import { Repository } from 'typeorm';

@Injectable()
export class Walletservice {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
  ) {}

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

  async decryptWallet(passcode: string, salt: string, encryptedWalletJson: string){
      return await Web3Wallet.decryptWallet(passcode, encryptedWalletJson, salt)
  }

  async resetUserWallet(walletId: string, salt: string, staticEncryptedWallet: string, newPassword: string){
    const wallet = await this.walletRepo.findOneBy({walletId})
    if (!wallet) throw new BadRequestException({message: 'No Wallet Found!. Please try again. If Problem persist contact support'})
    const newPasswordEncryptedJson = await Web3Wallet.resetWalletWithsalt(staticEncryptedWallet, salt, newPassword)
    return await this.walletRepo.save({...wallet, passwordEncryptedWallet: newPasswordEncryptedJson})
  }
}
