import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [
    UserModule, 
    PassportModule,
    JwtModule.register({
      signOptions: {expiresIn: '3600s'}
    })],
  providers: [AuthService, UserService],
  exports: [AuthService]
})
export class AuthModule {}
