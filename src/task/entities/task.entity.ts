import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Status {
  CREATED = 'to do',
  DONE = 'done',
  IN_PROGRESS = 'in progress',
}

// TODO: Add scope/theme/project for task (ManyToOne)
@Entity({ name: 'tasks' })
export class Task {
  @ApiProperty({
    type: Number,
    description: 'Id (is unique number and generated automaticaly).',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    description: 'Title (length is from 1 to 50 symbols).',
    minLength: 1,
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @ApiProperty({
    type: String,
    description:
      'Description (max length is 500 symbols and by default is empty string).',
    maxLength: 500,
    default: '',
  })
  @Column({ type: 'varchar', length: 500, default: '' })
  description: string;

  @ApiProperty({
    enum: Status,
    enumName: 'Status',
    description: 'Task status.',
    default: Status.CREATED,
  })
  @Column({ type: 'enum', enum: Status, default: Status.CREATED })
  status: Status;

  @ApiProperty({
    type: Number,
    description: 'Estimated time (only integer).',
    nullable: true,
    default: null,
  })
  @Column({
    type: 'integer',
    name: 'estimated_time',
    nullable: true,
    default: null,
  })
  estimatedTime: number;

  @ApiProperty({
    type: Number,
    description: 'Spent time (only integer).',
    nullable: true,
    default: null,
  })
  @Column({
    type: 'integer',
    name: 'spent_time',
    nullable: true,
    default: null,
  })
  spentTime: number;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    type: Date,
    description: 'Created at (field is Date and generated automaticaly).',
  })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    update: false,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Updated at (field is Date and generated automaticaly).',
  })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
