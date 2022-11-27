import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/models/notifications.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UserModule],
  providers: [NotificationService]
})
export class NotificationModule {}
