import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs';
import { Property } from 'src/models/property.entity';
import { PropertyDetail } from 'src/models/propertyDetail.entity';
import { UserService } from 'src/user/user.service';
import { UtilService } from 'src/util/util.service';
import { Repository } from 'typeorm';
import { AddPropertyDto, ListPropertyDto } from './propertyDto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(PropertyDetail)
    private readonly detailRepo: Repository<PropertyDetail>,
    private readonly utilService: UtilService,
    private readonly userService: UserService,
  ) {}

  async getPerperty(name?: string, tokenId?: number, propertyId?: string) {
    return await this.propertyRepo.findOne({
      where: [{ name }, { tokenId }, { propertyId }],
      relations: { details: true },
    });
  }

  async addProperty(
    property: AddPropertyDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const existProperty = await this.getPerperty(property.name);
    if (existProperty)
      throw new BadRequestException({
        message: `Property with ${property.name} already exist. Please choose another name`,
      });
    const user = await this.userService.getUserById(userId);
    if (!user)
      throw new BadRequestException({
        message: 'Something went wrong. Contact Support',
      });
    let filePublicIds: { public_id: string; url: string }[] = [];
    const uploadFiles = await this.utilService.uploadPropertyImages(files);

    // uploading file to cloudinary
    for (let file of uploadFiles) {
      try {
        const upload = await this.utilService.uploadFileToCloudinary(file);
        filePublicIds.push({ public_id: upload.public_id, url: upload.url });
      } catch (error) {
        throw error;
      }
    }

    // after uploading to cloudinary, delete the files
    for (let file of uploadFiles){
      if (file.path){
        unlink(file.path, err => {if (err) console.log(err.message)})
      }
    }

    // saving property to db
    const detObj = this.detailRepo.create({
      images: filePublicIds.map((f) => f.url),
      propertyType: property.type ? property.type : null,
      landSize: property.landSize ? property.landSize : null,
      stories: property.stories ? property.stories : null,
    });
    const details = await this.detailRepo.save(detObj);
    const prop = this.propertyRepo.create({
      details,
      name: property.name,
      address: property.address,
      currentPrice: property.currentPrice ? property.currentPrice : null,
      user,
    });
   
    await this.propertyRepo.save(prop);

  }

  async getProperties(isListed?: boolean, userId?: string) {
    return await this.propertyRepo.find({
      where: [
        { isListed },
        { isListed, user: { userId } },
        { user: { userId } },
      ],
      relations: { details: true },
    });
  }

  async getAllProperties(isListed: boolean) {
    return await this.propertyRepo.find({
      where: { isListed },
      relations: { details: true },
    });
  }

  private async editProperty(property: Property, editDto: any){
    await this.propertyRepo.save({...property, updatedAt: new Date(), ...editDto})
  }

  async listProperty(propertyId: string, listPropertyDto: ListPropertyDto){
    const property = await this.getPerperty(undefined, undefined, propertyId)
    if (!property) throw new BadRequestException({messge: 'No Property Found!'})
    // todo:  make some smart contract transaction's to mint token for property
    // the smart contract returns the tokenId, 
    await this.editProperty(property, {...listPropertyDto, isListed: true})

  }
}
