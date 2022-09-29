import {ApiProperty} from '@nestjs/swagger'

export enum Roles  {
    SUPER_ADMIN='SUPER_ADMIN', ADMIN='ADMIN', USER='USER', CANDIDATE='Candidate', FACILITATOR='Facilatator' 
}

export enum Gender {
    MALE='Male', FEMALE='Female'
}

export enum OrganisatioType {
    SCHOOL='School', PRIVATE_INSTITUTION='Private Institution', OTHERS='Others'
}

export enum ElectionType {
    ONLINE='Online', PHYSICAL='Physical'
}


export class FileUploadDto {
    @ApiProperty({ type: [String], format: 'binary' })
    file: any[];
}
export enum PropertyType {
    MULtINATIONAL='MULtINATIONAL'
}

export enum Network {
    POLYGON='POLYGON', ETHEREUM='ETHEREUM'
}

export enum OrderType {
    BUY_CRYPTO='BUY_CRYPTO', SELL_CRYPTO='SELL_CRYPTO'
}

export enum OrderCurrency {
    NAIRA='NGN', CEDIS='GHC', DOLLARS='USD'
}

export class MessageResponseDto {
    @ApiProperty({type: String, enum: ['Success', 'Error' ]})
    type: string

    @ApiProperty({type: String})
    message: string

    constructor(type: 'Success' | 'Error' , message: string){
        this.message = message
        this.type = type
    }
}