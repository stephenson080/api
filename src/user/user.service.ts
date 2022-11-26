import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { UploadApiResponse } from 'cloudinary';
import { generateKey, verifyToken } from 'authenticator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { hash, compareSync } from 'bcrypt';
import {
  AddBankDto,
  CreateUserDto,
  ForgotpasswordDto,
  UserKYCDto,
} from './userDto';
import { PersonService } from 'src/person/person.service';
// import { Person } from 'src/models/person.entity';
import { MessageResponseDto, Roles } from 'src/utils/types';
import { UtilService } from 'src/util/util.service';
import { Walletservice } from './wallet.service';
import { Bank } from 'src/models/bank.entity';
import { Wallet } from 'src/models/wallet.entity';
import { unlink } from 'fs';
import { Property } from 'src/models/property.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Bank) private readonly bankRepo: Repository<Bank>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly personService: PersonService,
    private readonly walletService: Walletservice,
    private readonly utilService: UtilService,
  ) {}

  async getUserById(userId: string, person?: boolean, wallet?: boolean) {
    const user = await this.userRepo.findOne({
      where: { userId },
      relations: { person, wallet, banks: true, properties: true },
    });
    return user;
  }

  async getUserByWallet(walletAddress: string){
    return await this.userRepo.findOne({where: {wallet: {walletAddress}}, relations: {wallet: true}})
  }

  async createUser(user: CreateUserDto, file?: Express.Multer.File) {
    let upload: UploadApiResponse;
    let uploadedFile: { path: string; type: string }[];
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

      const secret = generateKey();

      if (file) {
        uploadedFile = this.utilService.validateFilesUpload({
          [file.fieldname]: [file],
        });
        upload = await this.utilService.uploadFileToCloudinary(uploadedFile[0]);
      }

      let wallet: Wallet;
      if (user.custom) {
        if (!user.walletAddress)
          throw new BadRequestException({
            message: 'Your wallet address is required',
          });
        wallet = await this.walletService.customWallet(user.walletAddress);
        const newPerson = await this.personService.createPerson(
          {
            phone: user.phone,
            fullName: user.fullName,
          },
          upload ? [upload.url] : undefined,
        );
        const newUser = this.userRepo.create({
          email: user.email,
          password: passwordHash,
          secret: secret.replace(' ', ''),
          role: user.role ? user.role : Roles.USER,
          wallet,
        });
        return await this.userRepo.save({
          ...newUser,
          person: newPerson,
        });
      }

      const newPerson = await this.personService.createPerson(
        {
          phone: user.phone,
          fullName: user.fullName,
        },
        upload ? [upload.url] : undefined,
      );

      const newUser = this.userRepo.create({
        email: user.email,
        password: passwordHash,
        secret: secret.replace(' ', ''),
        role: user.role ? user.role : Roles.USER,
        wallet,
      });
      const userObj = await this.userRepo.save({
        ...newUser,
        person: newPerson,
      });

      await this.createWallet(userObj.userId, user.password);

      this.utilService.sendMail(
        user.email,
        'Welcome to Blockplot, your fractional real estate platform',
        `Hello, ${user.fullName} your Registation was Successful`,
      );

      return userObj;
    } catch (error) {
      if (upload) {
        await this.utilService.deleteFileFromCloudinary(upload.public_id);
      }
      if (uploadedFile) {
        unlink(uploadedFile[0].path, (err) => {
          if (err) {
            console.log(err.message);
          }
        });
      }
      throw new UnprocessableEntityException({ message: error.message });
    }
  }

  async nonCustodialUserKyc(
    newUser: CreateUserDto,
    files: { path: string; type: string }[],
  ) {
    let filePublicIds: { public_id: string; url: string }[] = [];
    try {
      let wallet: Wallet;
      const existUser = await this.getUserByEmail(newUser.email);
      if (existUser)
        throw new Error(`An Account with Username ${newUser.email} Already exist`);
      const existPerson = await this.personService.getPerson(newUser.phone);
      if (existPerson)
        throw new Error(
          `An Account with Phone Number ${newUser.phone} Already exist`,
        );
      wallet = await this.walletService.getwallet(
        undefined,
        newUser.walletAddress,
      );
      if (wallet) {
        throw new Error('Wallet Already Exist');
      }
      wallet = await this.walletService.customWallet(newUser.walletAddress);

      for (let file of files) {
        try {
          const upload = await this.utilService.uploadFileToCloudinary(file);
          filePublicIds.push({ public_id: upload.public_id, url: upload.url });
        } catch (error) {
          throw error;
        }
      }

      const newPerson = await this.personService.createPerson(
        {
          phone: newUser.phone,
          fullName: newUser.fullName,
        },
        filePublicIds.map((f) => f.url),
      );

      const _newUser = this.userRepo.create({
        email: newUser.email,
        password: 'qwerty',
        role: Roles.USER,
        wallet,
      });

      await this.userRepo.save({ ..._newUser, person: newPerson });

      return new MessageResponseDto(
        'Success',
        'Document Uploaded!!, Please wait while we Verify your Details',
      );
    } catch (error) {
      for (let file of filePublicIds) {
        if (file.public_id) {
          await this.utilService.deleteFileFromCloudinary(file.public_id);
        }
      }
      throw new UnprocessableEntityException({ message: error.message });
    }
  }

  async createWallet(userId: string, passcode: string) {
    const user = await this.getUserById(userId, false, true);
    if (!user)
      throw new UnauthorizedException({ message: 'Something went wrong' });
    if (user.wallet)
      throw new BadRequestException({ message: 'you already have a wallet' });
    const isMatch = compareSync(passcode, user.password);
    if (!isMatch)
      throw new BadRequestException({
        message: 'Sorry your password is incorrect',
      });
    const wallet = await this.walletService.createWallet(passcode);
    await this.userRepo.save({ ...user, wallet });
    return new MessageResponseDto(
      'Success',
      `Wallet created! here is your wallet address ${wallet.walletAddress}`,
    );
  }

  async addUserAsset(userId: string, tokenId: number) {
    const user = await this.getUserById(userId);
    let newAssetArray: number[] = [];
    if (!user.myAssets) {
      const newAsset = await this.propertyRepo.findOneBy({ tokenId });
      if (!newAsset) {
        return;
      }
      newAssetArray = [tokenId];
      this.editUser(user.userId, { myAssets: newAssetArray });
      return;
    }
    const asset = user.myAssets.find((a) => a == tokenId);
    if (asset) {
      return;
    }
    const newAsset = await this.propertyRepo.findOneBy({ tokenId });
    if (!newAsset) {
      return;
    }
    newAssetArray = [...user.myAssets];
    newAssetArray.push(tokenId);

    this.editUser(user.userId, { myAssets: newAssetArray });
  }

  async removeUserAsset(userId: string, tokenId: number) {
    const user = await this.getUserById(userId);
    let newAssetArray: number[] = [];

    newAssetArray = user.myAssets.filter((a) => a != tokenId);

    this.editUser(user.userId, { myAssets: newAssetArray });
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
      });

      return new MessageResponseDto(
        'Success',
        `Documents Upload Successful, Please wait, while we verify your details`,
      );
    } catch (error) {
      // deleting image from cloudinary if there was an error
      // console.log(error, 'sdjsdjk');
      for (let file of filePublicIds) {
        if (file.public_id) {
          await this.utilService.deleteFileFromCloudinary(file.public_id);
        }
      }
      throw new UnprocessableEntityException({ message: error.message });
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

      // console.log(code);

      this.utilService.sendMail(
        user.email,
        'Reset Password',
        `We received a request to reset your password. Click the click below to reset password. Your code is: ${code}`,
      );
      return new MessageResponseDto('Success', 'Email Sent');
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      let resetWallet: any;
      const user = await this.userRepo.findOne({
        where: { token },
        relations: { wallet: true },
      });
      if (!user)
        throw new BadRequestException({
          message: 'This email Link has been used or it is invalid',
        });
      const passordHash = await this.hashPassword(newPassword);
      if (user.wallet) {
        resetWallet = await this.walletService.resetUserWallet(
          user.wallet.walletId,
          user.wallet.salt,
          user.wallet.staticEncryptedWallet,
          newPassword,
        );
      }

      await this.editUser(user.userId, {
        password: passordHash,
        token: null,
        wallet: resetWallet,
      });
      return new MessageResponseDto(
        'Success',
        'Your Password has been changed',
      );
    } catch (error) {
      throw error;
    }
  }

  async changePassword(newPassword: string, id: string) {
    let resetWallet: any;
    const user = await this.userRepo.findOne({
      where: { userId: id },
      relations: { wallet: true },
    });
    if (!user)
      throw new UnauthorizedException({
        message: 'Not Authorised',
      });
    if (user.wallet) {
      resetWallet = await this.walletService.resetUserWallet(
        user.wallet.walletId,
        user.wallet.salt,
        user.wallet.staticEncryptedWallet,
        newPassword,
      );
    }
    const passordHash = await this.hashPassword(newPassword);
    await this.editUser(user.userId, {
      password: passordHash,
      wallet: resetWallet,
    });
    return new MessageResponseDto('Success', 'Password Changed!');
  }

  async enable2Fa(userId: string, token: string) {
    const user = await this.getUserById(userId);
    if (!user) throw new UnauthorizedException({ message: 'Not authorised' });
    if (user.faEnabled)
      throw new BadRequestException({ message: '2FA already enabled' });
    const result = verifyToken(user.secret, token);
    if (!result) {
      throw new BadRequestException({ message: 'Invalid Token' });
    }
    await this.editUser(user.userId, { faEnabled: true });
    return new MessageResponseDto('Success', '2 Factor Enabled Successfully');
  }

  //admin services
  async deactivateActivateUser(userId: string) {
    const user = await this.userRepo.findOneBy({ userId });
    await this.editUser(userId, { isActive: !user.isActive });
  }

  async getAllUsers(userId: string, isActive?: boolean, isVerified?: boolean) {
    const user = await this.getUserById(userId);
    if (!user)
      throw new BadRequestException({
        message: 'Something went wrong. Contact Support',
      });
    if (user.role !== Roles.ADMIN && user.role !== Roles.SUPER_ADMIN)
      throw new UnauthorizedException({
        message: 'You are not Authorised to use this service',
      });
    if (!user.isVerified)
      throw new UnauthorizedException({
        message: "You can't use this service because you haven't been verified",
      });
    if (!user.isActive)
      throw new UnauthorizedException({
        message: 'You account has been Frozen. Contact Support',
      });
    return await this.userRepo.find({
      where: [{ isActive, isVerified }, { isActive }, { isVerified }, {}],
      relations: { person: true, wallet: true },
    });
  }

  async verifyUsersOrUser(userIdsOrUserId: string | string[], userId: string) {
    const user = await this.getUserById(userId);
    if (!user)
      throw new BadRequestException({
        message: 'Something went wrong. Contact Support',
      });
    if (user.role !== Roles.ADMIN && user.role !== Roles.SUPER_ADMIN)
      throw new UnauthorizedException({
        message: 'You are not Authorised to use this service',
      });
    if (!user.isVerified)
      throw new UnauthorizedException({
        message: "You can't use this service because you haven't been verified",
      });
    if (!user.isActive)
      throw new UnauthorizedException({
        message: 'You account has been Frozen. Contact Support',
      });
    if (typeof userIdsOrUserId === 'object') {
      for (let id of userIdsOrUserId) {
        await this.editUser(id, { isVerified: true });
      }
      return new MessageResponseDto(
        'Success',
        'You have Successfully Verified all users',
      );
    }
    await this.editUser(userIdsOrUserId, { isVerified: true });
    return new MessageResponseDto(
      'Success',
      'You have Successfully Verified a user',
    );
  }

  async addBank(userId: string, addBankDto: AddBankDto) {
    const user = await this.getUserById(userId);
    if (!user)
      throw new UnauthorizedException({
        message: 'You are not unthorised to use this service',
      });
    if (!user.isVerified)
      throw new BadRequestException({
        message: 'please Complete your KYC before you can use this service',
      });
    const bank = this.bankRepo.create(addBankDto);
    const newBank = await this.bankRepo.save(bank);
    await this.userRepo.save({
      ...user,
      banks: [...user.banks, newBank],
      updatedAt: new Date(),
    });
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
