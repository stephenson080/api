import {Entity, PrimaryColumn, Column, Generated} from 'typeorm'
import { Network } from 'src/utils/types';



@Entity()
export class WaitList{
    @Generated('uuid')
    @PrimaryColumn({
        type: 'uuid'
    })
    _id : string

    @Column({type: 'character varying'})
    name: string

    @Column({type: 'character varying'})
    phone: string

    @Column({type: 'character varying'})
    email: string
}