import {IsNotEmpty, IsString, IsEmail, IsArray} from 'class-validator'
import {Exclude} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'


export class CreateWalletDto {
    @ApiProperty({type: String, required: true})
    passcode: string
}

export class SendTransactionDto {
    @ApiProperty({type: String, required: true})
    to: string
    @ApiProperty({type: String, required: true})
    password: string
    @ApiProperty({type: Array, required: true})
    params: any[]
}