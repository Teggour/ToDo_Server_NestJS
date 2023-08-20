import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { Status } from '../entities/task.entity';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    type: Number,
    description: 'Spent time (only integer and is optional).',
  })
  @IsOptional()
  @IsInt()
  spentTime?: number;

  @ApiPropertyOptional({
    enum: Status,
    enumName: 'Status',
    description: 'Task status (is optional).',
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
