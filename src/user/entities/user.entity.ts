import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';

import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@src/task/entities/task.entity';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

// TODO: add an avatar column (upload file)
@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    type: Number,
    description: 'Id (is unique number and generated automaticaly).',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: String,
    description: 'First name (length is from 1 to 25 symbols).',
    minLength: 1,
    maxLength: 25,
  })
  @Column({ type: 'varchar', length: 25, name: 'first_name' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'Last name (length is from 1 to 25 symbols).',
    minLength: 1,
    maxLength: 25,
  })
  @Column({ type: 'varchar', length: 25, name: 'last_name' })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'Only email (field is unique)!',
    example: 'email@mail.com',
  })
  @Column({ unique: true })
  email: string;

  // @ApiPropertyOptional({
  //   type: String,
  //   description: 'Hashed password (only for Admin).',
  // })
  @Column({
    select: false,
  })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password) {
      const hashedPassword = await argon2.hash(this.password);

      this.password = hashedPassword;
    }
  }

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    isArray: true,
    default: [Role.User],
    description: 'Roles array (["user"] by default).',
  })
  @Column({ type: 'enum', enum: Role, array: true, default: [Role.User] })
  role: Role[];

  @OneToMany(() => Task, (task) => task.user, {
    cascade: true,
  })
  tasks: Task[];

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
