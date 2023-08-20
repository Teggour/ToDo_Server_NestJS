import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUserExist) {
      throw new BadRequestException(
        `User with email: ${createUserDto.email} already exists!`,
      );
    }

    const newUser = await this.createAndSave(createUserDto);

    return newUser;
  }

  async getMe(userData: TUserJwtData) {
    const user = await this.findOneById(userData.id);

    return user;
  }

  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) {
      throw new NotFoundException(`There isn't user with id: ${id}!`);
    }

    return user;
  }

  async getPasswordByEmail(email: string) {
    const { password } = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: {
        password: true,
      },
    });

    return password;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`There isn't user with email: ${email}!`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.createAndSave({ id, ...updateUserDto });

    return updatedUser;
  }

  async updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    const updatedUser = await this.userRepository.update(
      { id },
      updateUserRoleDto,
    );

    return updatedUser;
  }

  // TODO: soft delete
  async delete(id: number) {
    const deletedUser = await this.userRepository.delete({ id });

    return deletedUser;
  }

  private async createAndSave(dto: Partial<User>): Promise<User> {
    const newUserData = await this.userRepository.create(dto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = await this.userRepository.save(
      newUserData,
    );

    return userData as User;
  }
}
