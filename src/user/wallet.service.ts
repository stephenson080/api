import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {ethers} from 'ethers'
import { Wallet } from 'src/models/wallet.entity';
import { Repository } from 'typeorm';


@Injectable()
export class Walletservice {
    constructor(@InjectRepository(Wallet) private readonly walletRepo : Repository<Wallet> ){}

    async createWallet(passcode: string){
        const walletInstance = ethers.Wallet.createRandom()
        const jsonEncrpted = await walletInstance.encrypt(passcode)
        const wallet =  this.walletRepo.create({encryption: jsonEncrpted, walletAddress: walletInstance.address})
        return await this.walletRepo.save(wallet)
    }
}