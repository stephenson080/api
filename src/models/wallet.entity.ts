import {Entity, PrimaryColumn, Column, Generated} from 'typeorm'
import { Network } from 'src/utils/types';



@Entity()
export class Wallet{
    @Generated('uuid')
    @PrimaryColumn({
        type: 'uuid'
    })
    walletId : string

    @Column({type: 'character varying'})
    walletAddress: string

    @Column({type: 'character varying', nullable: true})
    salt: string

    @Column({
        nullable: true,
        type: 'character varying'
    })
    passwordEncryptedWallet: string

    @Column({
        nullable: true,
        type: 'character varying'
    })
    staticEncryptedWallet: string

    @Column({ type: 'enum', default: Network.POLYGON, enum: Network })
    network: Network
}