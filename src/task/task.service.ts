import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(userData: TUserJwtData, createTaskDto: CreateTaskDto) {
    const task = await this.taskRepository.save({
      ...createTaskDto,
      user: userData,
    });

    return task as Task;
  }

  async findAll(userData: TUserJwtData) {
    const tasks = await this.taskRepository.findBy({
      user: { id: userData.id },
    });

    // const tasks = await this.taskRepository
    //   .createQueryBuilder('task')
    //   .where('task.user.id= :userId', { userId: userData.id })
    //   .getMany();

    return tasks;
  }

  // TODO: create interceptor (check author or admin)
  async findOne(id: number, userId: number) {
    const task = await this.taskRepository.findOneBy({
      user: { id: userId },
      id: id,
    });

    if (!task) {
      throw new NotFoundException(
        `There isn't task with ID: ${id} for user with ID: ${userId}!`,
      );
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    await this.findOne(id, userId); // checking if the user has a current task

    const updatedTask = await this.taskRepository.update(
      { user: { id: userId }, id: id },
      updateTaskDto,
    );

    // const updatedTask = await this.findOne(id, userId); //get updated task

    return updatedTask;
  }

  // TODO: soft delete
  async delete(id: number, userId: number) {
    await this.findOne(id, userId); // checking if the user has a current task

    const deletedTask = await this.taskRepository.delete({ id });

    return deletedTask;
  }
}
