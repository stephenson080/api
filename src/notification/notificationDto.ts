import {IsNotEmpty, IsArray, IsString} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class CreateNotificationDto {
    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({type: String, required: true})
    @IsString()
    @IsNotEmpty()
    body: string
}

export class EditNotificationDto {
    @ApiProperty({type: [String], required: true})
    @IsArray()
    ids: string[]
}

export class DeleteNotifcationDto{
    @ApiProperty({type: [String], required: true})
    @IsArray()
    ids: string[]
}

export class NotificationResponseDto {
    @ApiProperty({type: String})
    notificationId: string

    @ApiProperty({type: String})
    title: string

    @ApiProperty({type: String})
    body: string

    @ApiProperty({type: String})
    updateAt: Date

    @ApiProperty()
    createdAt: Date
    
    @ApiProperty({type: Boolean})
    isSeen: boolean

    constructor(n : Partial<any>){
        Object.assign(n)
    }
}