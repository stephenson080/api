import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/models/property.entity';
import { PropertyDetail } from 'src/models/propertyDetail.entity';
import { UtilModule } from 'src/util/util.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property, PropertyDetail]), UtilModule, UserModule],
  providers: [PropertyService],
  controllers: [PropertyController]
})
export class PropertyModule {}
