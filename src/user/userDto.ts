import {IsNotEmpty, IsString, IsEmail, IsArray} from 'class-validator'
import {Exclude} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'
import {Gender, Roles} from '../utils/types'
import { PersonResponseDto } from 'src/person/personDto'
export class CreateUserDto {

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({type: String, required: false})
    @IsString()
    fullName: string

    @ApiProperty({type: String, required: true})
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    phone: string

}

export class UserResponseDto {
    @ApiProperty({type: String})
    userId: string

    @ApiProperty()
    person: PersonResponseDto

    @ApiProperty({type: String, enum: Roles})
    @Exclude()
    role: Roles

    @ApiProperty({type: Boolean})
    isVerified:boolean

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

    @ApiProperty({type: String})
    walletAddress: string

    constructor(user: Partial<any>, wallet: string){
        Object.assign(this, user)
        this.walletAddress = wallet
    }
}

export class LoginUserDto {
    @ApiProperty({type: String})
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({type: String})
    @IsString()
    @IsNotEmpty()
    password: string
}

export class LoggedInUserDto{
    @ApiProperty({type: String})
    access_token: string
}

export class UserKYCDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String})
    imageUrl: string
}

export class ForgotpasswordDto {
    @ApiProperty({type: String})
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    // @ApiProperty({type: String})
    // @IsString()
    // @IsNotEmpty()
    // frontEndUrl: string

}

export class ResetPasswordDto {
    @ApiProperty({type: String})
    @IsString()
    @IsNotEmpty()
    newPassword: string

    @ApiProperty({type: String})
    @IsString()
    @IsNotEmpty()
    code: string
}

export class VerifyUserDto {
    @ApiProperty({type: [String]})
    @IsArray()
    @IsNotEmpty()
    userIds: string[]
}

export class UserMessageResponseDto{
    @ApiProperty({type: String, enum: ['Success', 'Error' ]})
    type: string

    @ApiProperty({type: String})
    message: string

    constructor(type: 'Success' | 'Error' , message: string){
        this.message = message
        this.type = type
    }
}