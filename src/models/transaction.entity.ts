import { PaymentMethod, TransactionCurrency, TransactionType } from 'src/utils/types';
import { Entity, PrimaryColumn, Column, Generated, ManyToOne } from 'typeorm';
import { Bank } from './bank.entity';
import { User } from './user.entity';

@Entity()
export class Transaction {
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
  assetId: number;

  @Column({ nullable: true, type: 'bigint' })
  fiatAmount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionCurrency,
    nullable: false,
    default: TransactionCurrency.NAIRA,
  })
  currency: TransactionCurrency;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'timestamp without time zone' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp without time zone' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Bank, (bank) => bank.orders)
  bank: Bank;
}
