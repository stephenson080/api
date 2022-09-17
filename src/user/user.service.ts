import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { hash } from 'bcrypt';
import { CreateUserDto, ForgotpasswordDto, UserKYCDto } from './userDto';
import { PersonService } from 'src/person/person.service';
// import { Person } from 'src/models/person.entity';
import { MessageResponseDto } from 'src/utils/types';
import { UtilService } from 'src/util/util.service';
import { Walletservice } from './wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly personService: PersonService,
    private readonly walletService: Walletservice,
    private readonly utilService: UtilService,
  ) {}

  async getUserById(userId: string, person?: boolean, wallet?: boolean) {
    const user = await this.userRepo.findOne({
      where: { userId },
      relations: { person, wallet },
    });
    return user;
  }

  async createUser(user: CreateUserDto) {
    try {
      const existUser = await this.getUserByEmail(user.email);
      if (existUser)
        throw new Error(`An Account with Username ${user.email} Already exist`);
      const existPerson = await this.personService.getPerson(user.phone);
      if (existPerson)
        throw new Error(
          `An Account with Phone Number ${user.phone} Already exist`,
        );

      const passwordHash = await this.hashPassword(user.password);

      const newPerson = await this.personService.createPerson({
        phone: user.phone,
        fullName: user.fullName,
      });

      const newUser = this.userRepo.create({
        email: user.email,
        password: passwordHash,
      });
      await this.userRepo.save({
        ...newUser,
        person: newPerson,
      });

      this.utilService.sendMail(
        user.email,
        'Welcome to Blockplot, your fractional real estate platform',
        `Hello, ${user.fullName} your Registation was Successful`,
      );

      return new MessageResponseDto('Success', 'Resistration Success');
    } catch (error) {
      return new MessageResponseDto('Error', error.message);
    }
  }

  async createWallet(userId: string, passcode: string) {
    const user = await this.getUserById(userId, false, true);
    if (!user)
      throw new UnauthorizedException({ message: 'Something went wrong' });
    if (user.wallet)
      throw new BadRequestException({ message: 'you already have a wallet' });
    const wallet = await this.walletService.createWallet(passcode);
    await this.userRepo.save({ ...user, wallet });
    return new MessageResponseDto(
      'Success',
      `Wallet created successfully! here is your wallet address ${wallet.walletAddress}`,
    );
  }

  async getUserByEmail(email: string, person?: boolean) {
    return await this.userRepo.findOne({
      where: { email },
      relations: { person },
    });
  }

  async userKyc(userId: string, files: { path: string; type: string }[]) {
    let filePublicIds: { public_id: string; url: string }[] = [];
    try {
      const user = await this.getUserById(userId, true);
      if (!user)
        throw new UnauthorizedException({ message: 'Your not authorised' });
      if (user.isVerified)
        throw new BadRequestException({
          message: 'You have Already been Verified',
        });
      for (let file of files) {
        try {
          const upload = await this.utilService.uploadFileToCloudinary(file);
          filePublicIds.push({ public_id: upload.public_id, url: upload.url });
        } catch (error) {
          throw error;
        }
      }

      // await this.userRepo.manager.transaction(async (t) => {
      //   await t.save<Person>({
      //     ...user.person,
      //     imageUrl: filePublicIds[0].url,
      //     documentUrl: filePublicIds[2].url,
      //     videoUrl: filePublicIds[1].url,
      //   });

      //   await t.save<User>({ ...user, updatedAt: new Date() });
      // });
      await this.personService.editPerson(user.person.phone, {
        imageUrl: filePublicIds[1].url,
        documentUrl: filePublicIds[0].url,
        videoUrl: filePublicIds[2].url,
      });
      await this.userRepo.save({
        ...user,
        updatedAt: new Date(),
      });
      return new MessageResponseDto(
        'Success',
        `Document Upload Successful, Please wait, while we verify your details`,
      );
    } catch (error) {
      // deleting image from cloudinary if there was an error
      // console.log(error, 'sdjsdjk');
      for (let file of filePublicIds) {
        if (file.public_id) {
          await this.utilService.deleteFileFromCloudinary(file.public_id);
        }
      }
      return new MessageResponseDto('Error', error.message);
    }
  }

  async editUser(id: string, editUserDto: any) {
    try {
      const fetchedUser = await this.userRepo.find({
        where: [
          {
            userId: id,
          },
          {
            person: {
              personId: id,
            },
          },
        ],
      });
      if (!fetchedUser[0])
        throw new BadRequestException({ message: 'No User Found' });
      await this.userRepo.save({
        ...fetchedUser[0],
        ...editUserDto,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotpasswordDto: ForgotpasswordDto) {
    try {
      const user = await this.getUserByEmail(forgotpasswordDto.email, true);
      if (!user)
        throw new BadRequestException({
          message: `No Account found with ${forgotpasswordDto.email}`,
        });
      const person = await this.personService.getPerson(user.person.phone);
      if (!person)
        throw new BadRequestException({
          message: `The Email ${forgotpasswordDto.email} is not registered in our Database`,
        });
      const token = uuid();
      const code = token.split('-')[0];
      await this.editUser(person.personId, { token: code });

      console.log(code)

      // this.utilService.sendMail(
      //   user.email,
      //   'Reset Password',
      //   `We received a request to reset your password. Click the click below to reset password. Your code is: ${code}`,
      // );
      return new MessageResponseDto('Success', 'Email Sent');
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.userRepo.findOneBy({ token });
      if (!user)
        throw new BadRequestException({
          message: 'This email Link has been used or it is invalid',
        });
      const passordHash = await this.hashPassword(newPassword);
      await this.editUser(user.userId, { password: passordHash, token: null });
      return new MessageResponseDto(
        'Success',
        'Your Password has been changed',
      );
    } catch (error) {
      throw error;
    }
  }

  //admin services
  async deactivateUser(userId: string) {
    // todo: make some smart contract calls
    await this.editUser(userId, { isActive: false });
  }

  async getAllUsers(isActive?: boolean, isVerified?: boolean) {
    return await this.userRepo.find({
      where: [{ isActive, isVerified }, { isActive }, { isVerified }, {}],
    });
  }

  async verifyUsersOrUser(userIdsOrUserId: string | string[]) {
    if (typeof userIdsOrUserId === 'object') {
      for (let id of userIdsOrUserId) {
        // to do: make some smart contract transactions
        await this.editUser(id, { isVerified: true });
      }
      return new MessageResponseDto(
        'Success',
        'You have Successfully Verified all users',
      );
    }
    // to do: make some smart contract transactions
    await this.editUser(userIdsOrUserId, { isVerified: true });
    return new MessageResponseDto(
      'Success',
      'You have Successfully Verified a user',
    );
  }

  private async hashPassword(password: string) {
    const promise = new Promise((res: (value: string) => void, reject) => {
      hash(password, 10, (err, hash) => {
        if (err) reject(err);
        res(hash);
      });
    });

    return await promise;
  }
}
