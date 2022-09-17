import {Entity, PrimaryColumn, Column, ManyToOne, Generated} from 'typeorm'
import { PropertyType } from 'src/utils/types';



@Entity()
export class PropertyDetail{
    @Generated('uuid')
    @PrimaryColumn({
        type: 'uuid'
    })
    id : string

    @Column({
        type: 'bigint',
        default: 0
    })
    totalUnits: number

    @Column({
        nullable: true
    })
    stories: number

    @Column({
        type: 'bigint', nullable: true
    })
    landSize :number

    @Column({type: 'simple-array', nullable: true})
    images: string[]

    @Column({ type: 'enum', nullable: true, enum: PropertyType })
    propertyType: PropertyType
}