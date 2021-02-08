import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getAllTasks(
        filterTasksDto: FilterTasksDto,
        user: User,
    ): Promise<Task[]> {
        return this.taskRepository.getAllTasks(filterTasksDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { id, userId: user.id },
        });

        if (!task)
            throw new NotFoundException(`Task with id "${id}" not found`);

        return task;
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({
            id,
            userId: user.id,
        });

        if (result.affected === 0)
            throw new NotFoundException(`Task with id "${id}" not found`);
    }

    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        task.save();

        return task;
    }
}
