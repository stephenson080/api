import { OrderCurrency, OrderType } from 'src/utils/types';
import { Entity, PrimaryColumn, Column, Generated, ManyToOne } from 'typeorm';
import { Bank } from './bank.entity';
import { User } from './user.entity';

@Entity()
export class Order {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid' })
  orderId: string;

  @Column({ nullable: false })
  reference: string;

  @Column({ nullable: false })
  tokenAddress: string;

  @Column({ nullable: true })
  authorizationUrl: string;

  @Column({ nullable: true })
  accessCode: string;

  @Column({ nullable: true, type: 'bigint' })
  tokenAmount: number;

  @Column({ nullable: true, type: 'bigint' })
  fiatAmount: number;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderCurrency,
    nullable: false,
    default: OrderCurrency.NAIRA,
  })
  currency: OrderCurrency;

  @Column({ type: 'timestamp without time zone', default: new Date() })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp without time zone', default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Bank, (bank) => bank.orders)
  bank: Bank;
}
