import {IsNotEmpty, IsString, IsEmail, IsArray} from 'class-validator'
import {Exclude} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'


export class CreateWalletDto {
    @ApiProperty({type: String, required: true})
    passcode: string
}