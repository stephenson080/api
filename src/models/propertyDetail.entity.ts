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
        type: 'decimal',
        default: 0
    })
    totalUnits: number

    @Column({
        type: 'decimal',
        default: 0
    })
    rent: number


    @Column({
        type: 'smallint',
        nullable: true
    })
    stories: number

    @Column({
        type: 'decimal', nullable: true
    })
    landSize :number

    @Column({
        type: 'decimal', nullable: true
    })
    latitude :number

    @Column({
        type: 'decimal', nullable: true
    })
    longitude :number

    @Column({type: 'simple-array', nullable: true})
    images: string[]

    @Column({type: 'simple-array', nullable: true})
    documents: string[]

    @Column({ type: 'enum', nullable: true, enum: PropertyType })
    propertyType: PropertyType
}