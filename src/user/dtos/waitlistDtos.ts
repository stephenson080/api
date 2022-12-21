import {IsNotEmpty, IsString, IsEmail, IsArray} from 'class-validator'
import {Exclude} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'

export class AddToWaitListDto {
    @ApiProperty({type: String, required: true})
    email: string

    @ApiProperty({type: String, required: true})
    name: string

    @ApiProperty({type: String, required: true})
    phone: string
}