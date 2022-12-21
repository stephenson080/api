import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaitList } from 'src/models/waitlist.entity';
import { UtilService } from 'src/util/util.service';
import { Repository } from 'typeorm';
import { AddToWaitListDto } from '../dtos/waitlistDtos';

@Injectable()
export class WaitListService {
  constructor(
    @InjectRepository(WaitList)
    private readonly waitlistRepo: Repository<WaitList>,
    private readonly utilService: UtilService,
  ) {}

  async getWaitListByEmailOrPhone(email?: string, phone?: string) {
    return await this.waitlistRepo.findOne({ where: [{ email }, { phone }] });
  }

  async addToWaitList(addToWaitListDto: AddToWaitListDto) {
    const existingWaitList = await this.getWaitListByEmailOrPhone(
      addToWaitListDto.email,
      addToWaitListDto.phone,
    );
    if (existingWaitList)
      throw new BadRequestException({
        message: `${addToWaitListDto.email} or ${addToWaitListDto.phone} already exist in our Database`,
      });

    const waitList = this.waitlistRepo.create(addToWaitListDto);
    await this.waitlistRepo.save(waitList);
    this.utilService.sendMail(
      addToWaitListDto.email,
      'Blockplot WaitList',
      'Thanks for Showing Interest in Blockplot. We shall notify you when we launch.'
    );
  }
}
