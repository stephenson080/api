import { Entity, PrimaryColumn, Column, Generated, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid' })
  notificationId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  body: string;

  @Column({ type: 'timestamp without time zone' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isSeen: boolean;

  @Column({ type: 'timestamp without time zone', })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.banks)
  user: User;
}
