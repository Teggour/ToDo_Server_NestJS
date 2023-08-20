import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from '@src/common/interceptors/transform-response.interceptor';
import { AuthUser } from '@src/common/decorators/auth-user.decorator';
import { ResponseMessage } from '@src/common/decorators/response-message.decorator';
import { TUserJwtData } from '@src/common/interfaces/user-jwt-data.interface';
import { HttpExceptionBodyDto } from '@src/common/dto/http-exception-body.dto';
import { Task } from './entities/task.entity';
import { ApiTransformedOkResponse } from '@src/common/decorators/api-transformed-response.decorator';
import { DeleteResultDto } from '@src/common/dto/delete-result.dto';
import { UpdateResultDto } from '@src/common/dto/update-result.dto';

@UseGuards(JwtAuthGuard)
@UseInterceptors(TransformResponseInterceptor)
@ApiTags('Task')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: HttpExceptionBodyDto,
  description:
    'Unauthorized response. You have to add a Bearer Token to request!',
})
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ResponseMessage('Task created.')
  @ApiBody({ type: CreateTaskDto })
  @ApiTransformedOkResponse({ model: Task })
  create(@AuthUser() user: TUserJwtData, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(user, createTaskDto);
  }

  @Get('getAll')
  @ApiTransformedOkResponse({ model: Task, isArray: true })
  findAll(@AuthUser() user: TUserJwtData) {
    return this.taskService.findAll(user);
  }

  @Get(':id')
  @ApiNotFoundResponse({
    type: HttpExceptionBodyDto,
    description: 'Not found response. ID must be contained in DB!',
  })
  @ApiTransformedOkResponse({ model: Task })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: TUserJwtData,
  ) {
    return this.taskService.findOne(id, user.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ResponseMessage('Task updated.')
  @ApiBody({ type: UpdateTaskDto })
  @ApiNotFoundResponse({
    type: HttpExceptionBodyDto,
    description: 'Not found response. ID must be contained in DB!',
  })
  @ApiTransformedOkResponse({ model: UpdateResultDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @AuthUser() user: TUserJwtData,
  ) {
    return this.taskService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @ResponseMessage('Task deleted.')
  @ApiNotFoundResponse({
    type: HttpExceptionBodyDto,
    description: 'Not found response. ID must be contained in DB!',
  })
  @ApiTransformedOkResponse({ model: DeleteResultDto })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: TUserJwtData,
  ) {
    return this.taskService.delete(id, user.id);
  }
}
