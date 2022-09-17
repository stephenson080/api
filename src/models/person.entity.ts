import {Entity, PrimaryColumn, Column, ManyToOne, Generated} from 'typeorm'



@Entity()
export class Person{
    @Generated('uuid')
    @PrimaryColumn({
        type: 'uuid'
    })
    personId : string

    @Column({
        nullable: false
    })
    fullName: string

    @Column({
        nullable: false, unique: true
    })
    phone :string

    @Column({type: 'character varying', default: 'null'})
    imageUrl: string

    @Column({type: 'character varying', default: 'null'})
    documentUrl: string

    @Column({type: 'character varying', default: 'null'})
    videoUrl: string
}