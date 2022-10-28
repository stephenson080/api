import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/models/notifications.entity';
import { UserService } from 'src/user/user.service';
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
    return await this.notificationRepo.save({...notification, user})
    
  }

  async getUsersNotifications(userId: string){
    return await this.notificationRepo.find({where: {user: {userId}}})
  }
}
