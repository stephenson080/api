import {IsNotEmpty, IsEmail, IsString, IsNumber} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { PropertyType } from 'src/utils/types'
import { UserResponseDto } from 'src/user/dtos/userDto'

export class AddPropertyDto {
    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty({type: Number, required: false})
    @IsNumber()
    stories: number

    @ApiProperty({type: Number, required: true})
    @IsNumber()
    rent: number

    @ApiProperty({type: Number, required: false})
    @IsNumber()
    currentPrice: number

    @ApiProperty({type: Number, required: false})
    @IsNumber()
    landSize?: number

    @ApiProperty({type: String, required: false, enum: PropertyType})
    @IsString()
    type?: PropertyType
}

export class GetMyAssetsDto{
    @ApiProperty({type: [Number]})
    tokenIds: number[]
}

export class PropertyResponseDto {
    @ApiProperty({type: String})
    propertyId: string

    @ApiProperty({type: String})
    name: string

    @ApiProperty({type: String})
    address: string

    @ApiProperty({type: Number})
    currentPrice: number

    @ApiProperty({type: Number})
    tokenPrice: number

    @ApiProperty({type: String})
    assetOnChainAddress: string

    @ApiProperty({type: Number})
    tokenId: number

    @ApiProperty({type: Number})
    APY: number

    @ApiProperty({type: Number})
    latitude: number

    @ApiProperty({type: Number})
    longitude: number

    @ApiProperty({type: Boolean})
    isListed: boolean

    @ApiProperty()
    details: any

    @ApiProperty()
    metadata: any


    @Exclude()
    isActive: boolean

    @Exclude()
    password:string

    @Exclude()
    token:string

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    @Exclude()
    user: UserResponseDto | undefined

    constructor(user: Partial<any>, metadata: any){
        Object.assign(this, user)
        this.metadata = metadata
    }
}

export class ListPropertyDto {

    @ApiProperty({type: Number})
    @IsNumber()
    @IsNotEmpty()
    tokenId: number
}