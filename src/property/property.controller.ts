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
  BadRequestException,
  UnprocessableEntityException,
  UnauthorizedException,
  ParseUUIDPipe,
  Query,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MessageResponseDto, PropertyType, Roles } from 'src/utils/types';
import { PropertyService } from './property.service';
import { UtilService } from '../util/util.service';
import {
  AddPropertyDto,
  ListPropertyDto,
  PropertyResponseDto,
} from './propertyDto';

@ApiTags('Property')
@Controller('Property')
export class PropertyController {
  constructor(
    private readonly utilService: UtilService,
    private readonly propertyService: PropertyService,
  ) {}
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Property Added', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }, { name: 'documents' }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'string',
          format: 'binary',
        },
        documents: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        rent: {
          type: 'number',
        },
        address: {
          type: 'string',
        },
        stories: {
          type: 'number',
        },
        currentPrice: {
          type: 'number',
        },
        landSize: {
          type: 'number',
        },
        type: {
          type: 'string',
        },
      },
    },
    // description: 'Files',
    // type: FileUploadDto
  })
  @UseGuards(JwtAuthGuard)
  @Post('add-property')
  async addProperty(
    @Request() req: any,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      documents: Express.Multer.File[];
    },
    @Body() propertyDto: AddPropertyDto,
  ) {
    try {
      if (
        req.user.username !== Roles.AGENT &&
        req.user.username !== Roles.ADMIN &&
        req.user.username !== Roles.SUPER_ADMIN
      )
        throw new UnauthorizedException({
          message: 'You are not authorised to use this Service',
        });
      await this.propertyService.addProperty(
        propertyDto,
        files,
        req.user.userId,
      );
      return new MessageResponseDto('Success', 'Property Addedd');
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get Properties that are list or not',
    type: [PropertyResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Get('get-properties')
  async getProperties(@Query('isListed') isListed: boolean) {
    const properties = await this.propertyService.getProperties(isListed);
    return properties.map((p) => new PropertyResponseDto(p));
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get user's Properties that are list or not",
    type: [PropertyResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Get('agent/get-properties')
  async getUserProperties(
    @Query('isListed') isListed: boolean,
    @Request() req: any,
  ) {
    const properties = await this.propertyService.getProperties(
      isListed,
      req.user.userId,
    );
    return properties.map((p) => new PropertyResponseDto(p));
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Admin gets all properties that are listed or not listed',
    type: [PropertyResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Get('admin/get-properties')
  async getAllProperties(
    @Query('isListed') isListed: boolean,
    @Request() req: any,
  ) {
    if (req.user.username !== Roles.ADMIN)
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    const properties = await this.propertyService.getAllProperties(isListed);
    return properties.map((p) => new PropertyResponseDto(p));
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Admin after review property mint's token for property",
    type: MessageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  @ApiUnauthorizedResponse({ description: 'Not authorised' })
  @UseGuards(JwtAuthGuard)
  @Patch('admin/list-property/:propertyId')
  async listProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Request() req: any,
    @Body() listPropertyDto: ListPropertyDto,
  ) {
    if (req.user.username !== Roles.ADMIN || req.user.username !== Roles.ADMIN)
      throw new UnauthorizedException({
        message: 'you are not authorised to use this service',
      });
    await this.propertyService.listProperty(propertyId, listPropertyDto);
    return new MessageResponseDto(
      'Success',
      'Property successfully Minted and Listed',
    );
  }

 
}
