import { Roles } from 'src/utils/types';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  Generated,

  OneToMany
} from 'typeorm';
import { Bank } from './bank.entity';
import { Order } from './order.entity';
import { Person } from './person.entity';
import { Property } from './property.entity';
import { Wallet } from './wallet.entity';

@Entity()
  export class User {
    @Generated('uuid')
    @PrimaryColumn({ type: 'uuid' })
    userId: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false, type: 'character varying' })
    password: string;

    @Column({ type: 'enum', default: Roles.USER, enum: Roles })
    role: Roles

    @Column({ type: 'timestamp without time zone', default: new Date() })
    createdAt: Date;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({ nullable: true})
    token: string

    @Column({ type: 'timestamp without time zone', default: new Date() })
    updatedAt: Date;

    @OneToMany(() => Property, (property) => property.user)
    properties: Property[]

    @OneToMany(() => Bank, (bank) => bank.user)
    banks: Bank[]

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;

    @OneToOne(() => Wallet)
    @JoinColumn()
    wallet: Wallet;

    
  }
