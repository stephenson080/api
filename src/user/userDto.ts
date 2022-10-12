import {IsNotEmpty, IsString, IsEmail, IsArray, IsBoolean} from 'class-validator'
import {Exclude} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'
import {Roles} from '../utils/types'
import { PersonResponseDto } from 'src/person/personDto'
export class CreateUserDto {

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({type: String, required: true})
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

    @ApiProperty({type: String, required: false})
    walletAddress?: string

    @ApiProperty({type: Boolean, required: false})
    custom?: boolean

    @ApiProperty({type: String, enum: Roles, required: false})
    role?: Roles

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

    @ApiProperty({type: String})
    secret:string

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    @ApiProperty({type: String})
    walletAddress: string

    @ApiProperty({type: String})
    twoFAUri: string

    constructor(user: Partial<any>, wallet: string, uri: string){
        Object.assign(this, user)
        this.walletAddress = wallet
        this.twoFAUri= uri
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

export class Enable2FaDto {
    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    token: string
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

export class AddBankDto {
    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    bankName: string

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    accountName: string

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    accountNumber: string
}

export class ChangePasswordDto {
    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    newPassword: string
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