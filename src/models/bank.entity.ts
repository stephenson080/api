import { Entity, PrimaryColumn, Column, Generated, ManyToOne, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

@Entity()
export class Bank {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid' })
  bankId: string;

  @Column({ nullable: false })
  bankName: string;

  @Column({ nullable: false })
  accountName: string;

  @Column({ nullable: false })
  accountNumber: string;

  @Column({ type: 'timestamp without time zone', default: new Date() })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp without time zone', default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.banks)
  user: User;

  @OneToMany(() => Order, (order) => order.bank)
  orders: Order[];
}
