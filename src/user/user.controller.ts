import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  Param,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
  Patch,
  ParseUUIDPipe,
  Query,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { unlinkSync } from 'fs';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { generateTotpUri } from 'authenticator';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  MessageResponseDto,
  Roles,
  TransactionCurrency,
  TransactionType,
} from 'src/utils/types';
import { UserService } from './services/user.service';
import { UtilService } from '../util/util.service';
import {
  AddBankDto,
  ChangePasswordDto,
  CreateUserDto,
  DemoKycDto,
  Enable2FaDto,
  ForgotpasswordDto,
  LoggedInUserDto,
  LoginUserDto,
  ResetPasswordDto,
  TestnetFaucetDto,
  UserResponseDto,
  VerifyUserDto,
} from './dtos/userDto';
import { PersonResponseDto } from '../person/personDto';
import { CreateWalletDto, SendTransactionDto } from './dtos/walletDto';
import { TransactionService } from 'src/transaction/services/transaction.service';
import { Walletservice } from './services/wallet.service';

import { getAssetMetadata, getAssetBalance } from '../web3/asset';
import { PropertyService } from 'src/property/property.service';
import { WaitListService } from 'src/user/services/waitlist.service';
import { NotificationService } from 'src/notification/notification.service';
import {
  DeleteNotifcationDto,
  EditNotificationDto,
  NotificationResponseDto,
} from 'src/notification/notificationDto';
import { AddToWaitListDto } from './dtos/waitlistDtos';

@ApiTags('User')
@Controller('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
    private readonly transactionService: TransactionService,
    private readonly walletService: Walletservice,
    private readonly propertyService: PropertyService,
    private readonly notificationService: NotificationService,
    private readonly waitListService: WaitListService,
  ) {}

  @Post('login')
  @ApiCreatedResponse({ type: LoggedInUserDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Wrong email or password' })
  async loginUser(@Body() details: LoginUserDto) {
    const user = await this.authService.validateUserCredentials(
      details.email,
      details.password,
    );
    return await this.authService.loginWithCredentials(user);
  }

  @Put('register')
  @ApiOkResponse({ description: 'User Created!', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  async addUser(@Body() user: CreateUserDto) {
    await this.userService.createUser(user);
    return new MessageResponseDto('Success', "Registration Success")
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get user Profile', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.getUserById(
      req.user.userId,
      true,
      true,
    );
    const walletAddress = user.wallet ? user.wallet.walletAddress : '';
    let uri = '';
    if (user.secret) {
      uri = generateTotpUri(
        user.secret,
        user.email,
        'Blockplot',
        'SHA1',
        6,
        30,
      );
    }
    if (user.wallet) delete user.wallet;
    
    return new UserResponseDto(user, walletAddress, uri);
  }

  @ApiOkResponse({
    description: 'Adds new Real estate Company',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseInterceptors(FileInterceptor('document'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          format: 'binary',
        },
        fullName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
        walletAddress: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        role: {
          type: 'string',
        },
        custom: {
          type: 'boolean',
        },
      },
    },
    // description: 'Files',
    // type: FileUploadDto
  })
  @Post('register-real-estate')
  async registerRealEstate(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    await this.userService.createUser(createUserDto, file);
    return new MessageResponseDto('Success', 'Registration Success')
  }

  @ApiOkResponse({
    description: 'KYC for non Custodial users',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_url', maxCount: 1 },
      { name: 'document_url', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image_url: {
          type: 'string',
          format: 'binary',
        },
        document_url: {
          type: 'string',
          format: 'binary',
        },
        fullName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
        walletAddress: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        role: {
          type: 'string',
        },
        custom: {
          type: 'boolean',
        },
      },
    },
    // description: 'Files',
    // type: FileUploadDto
  })
  @Post('non-custodial-kyc')
  async nonCustodialUserKyc(
    @UploadedFiles()
    files: {
      image_url: Express.Multer.File[];
      document_url: Express.Multer.File[];
    },
    @Body() createUserDto: CreateUserDto,
  ) {
    const filesUrls = this.utilService.validateFilesUpload(files);
    return await this.userService.nonCustodialUserKyc(createUserDto, filesUrls)
  }

  @ApiOkResponse({
    description: 'get non Custodial user',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' }) 
  @Get('get-non-custodial-user/:wallet')
  async getNonCustodialUser(@Param('wallet') walletAddress: string
  ) {
    const user = await this.userService.getUserByWallet(walletAddress)
    if (!user){
      return undefined
    }
    const address = user.wallet ? user.wallet.walletAddress : '';
    if (user.wallet) delete user.wallet
    return new UserResponseDto(user, address, '')
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User is Verified', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_url', maxCount: 1 },
      { name: 'document_url', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image_url: {
          type: 'string',
          format: 'binary',
        },
        document_url: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    // description: 'Files',
    // type: FileUploadDto
  })
  @UseGuards(JwtAuthGuard)
  @Patch('user-KYC')
  async userKYC(
    @Request() req: any,
    @UploadedFiles()
    files: {
      image_url: Express.Multer.File[];
      document_url: Express.Multer.File[];
    },
  ) {
    try {
      const filesUrls = this.utilService.validateFilesUpload(files);
      const message = await this.userService.userKyc(
        req.user.userId,
        filesUrls,
      );
      for (let file of filesUrls) {
        if (file.path) {
          unlinkSync(file.path);
        }
      }
      return message;
    } catch (error) {
      throw error;
    }
  }

  @ApiOkResponse({ description: 'Email sent!', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotpasswordDto: ForgotpasswordDto) {
    return await this.userService.forgotPassword(forgotpasswordDto);
  }

  @ApiOkResponse({ description: 'Demo KYC', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @Post('/demo-kyc')
  async demoKYC(@Body() demoKycDto: DemoKycDto) {
    return await this.userService.demoKyc(demoKycDto.walletAddress, demoKycDto.custodial)
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiOkResponse({ description: 'Password Change!', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  async changepassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ) {
    return await this.userService.changePassword(
      changePasswordDto.newPassword,
      req.user.userId,
    );
  }

  @ApiOkResponse({ description: 'Password Changed!', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @Patch('/reset-password/')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: '2FA enabled!', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Post('/enable-2fa/')
  async enabled2Fa(@Body() enable2FaDto: Enable2FaDto, @Request() req: any) {
    return await this.userService.enable2Fa(
      req.user.userId,
      enable2FaDto.token,
    );
  }

  @ApiOkResponse({ description: 'Faucet for Testing', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @Post('/faucet')
  async testFaucet(@Body() testFaucetDto: TestnetFaucetDto) {
    await this.userService.testnetFaucet(testFaucetDto)
    return new MessageResponseDto('Success', "Test BUSD is on it way to your Wallet" )
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Gets user notifications',
    type: [NotificationResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Get('/notification/get')
  async getUserNotifications(@Request() req: any) {
    return await this.notificationService.getUsersNotifications(
      req.user.userId,
    );
    
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Edit Notifications',
    type: [NotificationResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Post('/notification/edit')
  async editNotification(
    @Request() req: any,
    @Body() editNotificationDto: EditNotificationDto,
  ) {
    for (let id of editNotificationDto.ids) {
      await this.notificationService.editNotification(id, { isSeen: true });
    }
    return await this.notificationService.getUsersNotifications(
      req.user.userId,
    );
  }
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete Notification', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Delete('notification/delete/:id')
  async deleteNotification(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    await this.notificationService.deleteUserNotifications(req.user.userIs, [id])
    return new MessageResponseDto('Success', `Notification Deleted`);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete Notifications', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Delete('notification/delete')
  async deleteNotifications(@Request() req: any, @Body() deleteNoticationsDto: DeleteNotifcationDto) {
    await this.notificationService.deleteUserNotifications(req.user.userIs, deleteNoticationsDto.ids)
    return new MessageResponseDto('Success', `Notifications Deleted`);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Bank Added!', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Post('bank/add-bank')
  async addUserBank(@Body() addBankDto: AddBankDto, @Request() req: any) {
    await this.userService.addBank(req.user.userId, addBankDto);
    await this.notificationService.createNotification(req.user.userId, {
      title: 'Bank Added',
      body: 'You just added a Bank',
    });
    const notifications = await this.notificationService.getUsersNotifications(
      req.user.userId,
    );
    const msg = new MessageResponseDto('Success', `Transaction Successful`);
    return {
      message: msg,
      notifications: notifications
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Edit Bank details', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Put('bank/edit-bank/:bankId')
  async editUserBank(@Body() addBankDto: AddBankDto, @Request() req: any, @Param('bankId', ParseUUIDPipe) bankId: string) {
    await this.userService.editBankDetails(req.user.userId, bankId, addBankDto);
    return new MessageResponseDto('Success', `Bank Edited Successfully`);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Delete Bank', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Delete('bank/delete-bank/:bankId')
  async deleteUserBank(@Request() req: any, @Param('bankId', ParseUUIDPipe) bankId: string) {
    await this.userService.deleteBank(req.user.userId, bankId);
    return new MessageResponseDto('Success', `Bank Deleted`);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User creates wallet',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Put('wallet/create')
  async createUserWallet(
    @Request() req: any,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return await this.userService.createWallet(
      req.user.userId,
      createWalletDto.passcode,
    );
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User send crypto to other wallet',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Post('wallet/send-transaction')
  async sendTransaction(
    @Request() req: any,
    @Body() sendTransactionDto: SendTransactionDto,
    @Query('contract')
    contract: 'token' | 'initialSale' | 'blockplot' | 'swap',
    @Query('function') contractFunction: string,
  ) {
    const user = await this.userService.getUserById(
      req.user.userId,
      false,
      true,
    );
    if (!user)
      throw new UnauthorizedException({
        message: 'Sorry you are not unauthorised',
      });
    if (!user.isVerified)
      throw new UnauthorizedException({
        message: "you have'nt to completed your Kyc",
      });
    if (!user.wallet)
      throw new UnauthorizedException({
        message: "you don't have a wallet yet",
      });
    const transaction = await this.walletService.sendWalletTransaction(
      user.wallet,
      sendTransactionDto.password,
      sendTransactionDto.params,
      contract,
      contractFunction,
      sendTransactionDto.to,
    );
    if (contractFunction === 'buyAsset' || (contract === 'swap' && !sendTransactionDto.params[3])) {
      this.notificationService.createNotification(req.user.userId, {
        title: 'Asset Purchase Successful',
        body: 'You just purchased an Asset. Check out the My Asset to view the transaction details',
      });
    }
    if (contract === 'swap' && sendTransactionDto.params[3]) {
      this.notificationService.createNotification(req.user.userId, {
        title: 'Asset Sale Successful',
        body: 'You just Sold an Asset. Check out the My Asset to view the transaction details',
      });
    }

    if (contractFunction === 'transfer') {
      await this.notificationService.createNotification(req.user.userId, {
        title: 'Token Transfer Successful',
        body: 'You just transferred your tokens. Check out the Wallet Screen to view the transaction details',
      });
    }

    await this.transactionService.createTransaction(
      user.userId,
      transaction.createTransactionDto,
      true,
      transaction.reference,
    );
    const notifications = await this.notificationService.getUsersNotifications(
      req.user.userId,
    );
    const msg = new MessageResponseDto('Success', `Transaction Successful`);
    return {
      message: msg,
      notifications: notifications
    };
  }

  @ApiOkResponse({ description: 'Endpoint for Adding users to waitlist', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @Post('/waitlist')
  async addToWaitListHandler(@Body() addToWaitListDto: AddToWaitListDto) {
    await this.waitListService.addToWaitList(addToWaitListDto)
    return new MessageResponseDto('Success', 'Operation Successful')
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Admin gets all users',
    type: [UserResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Get('admin/get-all-users')
  async getAllUsers(
    @Request() req: any,
    @Query('isActive') isActive: boolean,
    @Query('isVerified') isVerified: boolean,
  ) {
    if (
      req.user.username !== Roles.ADMIN &&
      req.user.username !== Roles.SUPER_ADMIN
    )
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    const users = await this.userService.getAllUsers(
      req.user.userId,
      isActive,
      isVerified,
    );
    return users.map((u) => {
      const walletAddress = u.wallet ? u.wallet.walletAddress : '';
      if (u.wallet) delete u.wallet;
      if (u.secret) delete u.secret;

      // delete u.password
      return new UserResponseDto(u, walletAddress, '');
    });
  }
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Admin Get User',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Get('/admin/get-user/:userId')
  async getUserById(@Request() req: any, @Param('userId', ParseUUIDPipe) userId: string) {
    if (
      req.user.username !== Roles.ADMIN &&
      req.user.username !== Roles.SUPER_ADMIN
    )
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    const user = await this.userService.getUserById(userId, true, true)
    return new UserResponseDto(user, user.wallet ? user.wallet.walletAddress : '', '',)
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Activate and Deactivate user account',
    type: MessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Post('/admin/activate-deactivate-user/:userId')
  async activateDeactivateAccount(@Request() req: any, @Param('userId', ParseUUIDPipe) userId: string) {
    if (
      req.user.username !== Roles.ADMIN &&
      req.user.username !== Roles.SUPER_ADMIN
    )
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    await this.userService.deactivateActivateUser(userId)
    return new MessageResponseDto('Success', 'Operation Successful')
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Admin Verifies Users or User',
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/verify')
  async verifyUsersOrUser(
    @Request() req: any,
    @Body() verifyUserDto: VerifyUserDto,
  ) {
    if (
      req.user.username !== Roles.ADMIN &&
      req.user.username !== Roles.SUPER_ADMIN
    )
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    return await this.userService.verifyUsersOrUser(
      verifyUserDto.userIds.length === 1
        ? verifyUserDto.userIds[0]
        : verifyUserDto.userIds,
      req.user.userId,
    );
  }
}
