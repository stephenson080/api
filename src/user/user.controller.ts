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
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageResponseDto, Roles } from 'src/utils/types';
import { UserService } from './user.service';
import { UtilService } from '../util/util.service';
import {
  CreateUserDto,
  ForgotpasswordDto,
  LoggedInUserDto,
  LoginUserDto,
  ResetPasswordDto,
  UserResponseDto,
  VerifyUserDto,
} from './userDto';
import { PersonResponseDto } from '../person/personDto';
import { CreateWalletDto } from './walletDto';

@ApiTags('User')
@Controller('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
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
    const user = await this.userService.getUserById(req.user.userId, true, true);
    const walletAddress = user.wallet ? user.wallet.walletAddress : ''
    delete user.wallet
    return new UserResponseDto(user, walletAddress)
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
        },
        video_url: {
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
      video_url: Express.Multer.File[];
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

  @ApiOkResponse({ description: 'Password Changed!', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @Patch('/reset-password/:token')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token', ParseUUIDPipe) token: string,
  ) {
    return await this.userService.resetPassword(
      token,
      resetPasswordDto.newPassword,
    );
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
    return await this.userService.createWallet(req.user.userId, createWalletDto.passcode)
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
    if (req.user.username !== Roles.ADMIN)
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    const users = await this.userService.getAllUsers(isActive, isVerified);
    return users.map((u) => new UserResponseDto(u, ''));
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
