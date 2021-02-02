import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async getAllTasks(filterTasksDto: FilterTasksDto): Promise<Task[]> {
        return this.taskRepository.getAllTasks(filterTasksDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne(id);

        if (!task)
            throw new NotFoundException(`Task with id "${id}" not found`);

        return task;
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);

        if (result.affected === 0)
            throw new NotFoundException(`Task with id "${id}" not found`);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        task.save();

        return task;
    }
}
