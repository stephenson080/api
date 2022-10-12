import {IsNotEmpty, IsEmail, IsString} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
export class CreatePersonDto {
    // @IsString()
    // walletAddress: string

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    fullName: string

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    phone: string
}

export class PersonResponseDto {
    @Exclude()
    personId: string

    @ApiProperty({type: String})
    fullName: string

    @ApiProperty({type: String})
    phone: string

    @ApiProperty({type: String})
    walletAddress: string

    @ApiProperty({type: String})
    imageUrl: string

    @Exclude()
    documentUrl: string

    @Exclude()
    videoUrl: string

    constructor(p : Partial<any>){
        Object.assign(p)
    }
}