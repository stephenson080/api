import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/models/notifications.entity';
import { UserService } from 'src/user/services/user.service';
import { Repository } from 'typeorm';
// import { NotificationGateway } from './notification.gateway';
import { CreateNotificationDto } from './notificationDto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
    // private readonly notifyGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}

  async createNotification(userId: string, createNotificationDto: CreateNotificationDto){
    const user = await this.userService.getUserById(userId)
    const notification = this.notificationRepo.create(createNotificationDto)
    return await this.notificationRepo.save({...notification, user, createdAt: new Date(), updatedAt: new Date()})
    
  }

  async getUsersNotifications(userId: string, sortCreatedBy?: any){
    return await this.notificationRepo.find({where: {user: {userId}}, order: {createdAt: {direction: sortCreatedBy}}})
  }

  async deleteUserNotifications(userId: string, ids: string[]){
    for (let id of ids){
      const notic = await this.notificationRepo.findOne({where: {notificationId: id, user: {userId}}})
      if (!notic)
      await this.notificationRepo.delete({notificationId: id})
    }
  }

  async editNotification(notificationId: string, editNotificationDto: any){
    const notification = await this.notificationRepo.findOneBy({notificationId})
    if (!notification) throw new BadRequestException({message: 'Something went wrong'})
    editNotificationDto.updatedAt = new Date()
    await this.notificationRepo.save({...notification.updatedAt, ...editNotificationDto})
  }
}
