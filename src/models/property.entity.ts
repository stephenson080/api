import { Roles } from 'src/utils/types';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  Generated,
  ManyToOne
} from 'typeorm';
import { PropertyDetail } from './propertyDetail.entity';
import { User } from './user.entity';

@Entity()
  export class Property {
    @Generated('uuid')
    @PrimaryColumn({ type: 'uuid' })
    propertyId: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: true })
    tokenPrice: number;

    @Column({ nullable: true })
    assetOnChainAddress: string;

    @Column({ nullable: true })
    tokenId: number;

    @Column({ nullable: true })
    APY: number;

    @Column({ nullable: true })
    currentPrice: number;

    @Column({ type: 'timestamp without time zone' })
    createdAt: Date;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isListed: boolean;

    @Column({ type: 'timestamp without time zone' })
    updatedAt: Date;

    @OneToOne(() => PropertyDetail)
    @JoinColumn()
    details: PropertyDetail;

    @ManyToOne(() => User, (user) => user.properties)
    user: User
    
  }
