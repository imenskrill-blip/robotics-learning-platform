import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  ownerId: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'BASIC' })
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Course, (course) => course.organization)
  courses: Course[];

  @OneToMany(() => Subscription, (sub) => sub.organization)
  subscriptions: Subscription[];
}
