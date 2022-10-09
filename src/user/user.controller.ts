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
  Patch,
  ParseUUIDPipe,
  Query,
  UnauthorizedException,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {generateTotpUri} from 'authenticator'
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageResponseDto, Roles, TransactionCurrency, TransactionType } from 'src/utils/types';
import { UserService } from './user.service';
import { UtilService } from '../util/util.service';
import {
  AddBankDto,
  ChangePasswordDto,
  CreateUserDto,
  Enable2FaDto,
  ForgotpasswordDto,
  LoggedInUserDto,
  LoginUserDto,
  ResetPasswordDto,
  UserResponseDto,
  VerifyUserDto,
} from './userDto';
import { PersonResponseDto } from '../person/personDto';
import { CreateWalletDto, SendTransactionDto } from './walletDto';
import { TransactionService } from 'src/transaction/transaction.service';
import { Walletservice } from './wallet.service';
import { CreateOrderDto } from 'src/transaction/transactionDto';

@ApiTags('User')
@Controller('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
    private readonly transactionService: TransactionService,
    private readonly walletService: Walletservice,
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
    return await this.userService.createUser(user);
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
    let uri = ''
    if (user.secret){
      uri = generateTotpUri(user.secret, user.email, 'Blockplot', 'SHA1', 6, 30)
    }
    if (user.wallet) delete user.wallet;
    return new UserResponseDto(user, walletAddress, uri);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User is Verified', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image_url', maxCount: 1 },
      { name: 'document_url', maxCount: 1 },
      { name: 'video_url', maxCount: 1 },
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
        }
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

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiOkResponse({ description: 'Password Change!', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  async changepassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: any) {
    return await this.userService.changePassword(changePasswordDto.newPassword, req.user.userId)
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
  async enabled2Fa(@Body() enable2FaDto: Enable2FaDto, @Request() req: any,) {
    return await this.userService.enable2Fa(req.user.userId, enable2FaDto.token)
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Bank Added!', type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @UseGuards(JwtAuthGuard)
  @Post('bank/add-bank')
  async addUserBank(@Body() addBankDto: AddBankDto, @Request() req: any) {
    await this.userService.addBank(req.user.userId, addBankDto);
    return new MessageResponseDto('Success', 'Bank Successfully Added!');
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
    const user = await this.userService.getUserById(req.user.userId, false, true);
    if (!user)
      throw new UnauthorizedException({
        message: 'Sorry you are not unauthorised',
      });
    // if (!user.isVerified) throw new UnauthorizedException({message: "you have'nt to completed your Kyc"})
    const transaction = await this.walletService.sendWalletTransaction(
      user.wallet,
      sendTransactionDto.password,
      sendTransactionDto.params,
      contract,
      contractFunction,
      sendTransactionDto.to
    );
    
    await this.transactionService.createTransaction(user.userId, transaction.createTransactionDto, true, transaction.reference)
    return new MessageResponseDto('Success', `Transaction Successful. Here is your transaction hash ${transaction.reference}`)
  }

  // @ApiBearerAuth()
  // @ApiOkResponse({
  //   description: 'User creates wallet',
  //   type: MessageResponseDto,
  // })
  // @ApiBadRequestResponse({ description: 'Something went wrong' })
  // @ApiUnauthorizedResponse({ description: 'Not authorised' })
  // @UseGuards(JwtAuthGuard)
  // @Put('wallet/create')
  // async createUserWallet(
  //   @Request() req: any,
  //   @Body() createWalletDto: CreateWalletDto,
  // ) {
  //   return await this.userService.createWallet(req.user.userId, createWalletDto.passcode)
  // }

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
    if (req.user.username !== Roles.ADMIN)
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    const users = await this.userService.getAllUsers(isActive, isVerified);
    return users.map((u) => {
      const walletAddress = u.wallet ? u.wallet.walletAddress : '';
      if (u.wallet) delete u.wallet;
      if (u.secret)  delete u.secret
      return {
        ...new UserResponseDto(u, walletAddress, ''),
      };
    });
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
    if (req.user.username !== Roles.ADMIN)
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    return await this.userService.verifyUsersOrUser(
      verifyUserDto.userIds.length === 1
        ? verifyUserDto.userIds[0]
        : verifyUserDto.userIds,
    );
  }
}
