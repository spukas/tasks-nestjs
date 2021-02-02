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
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }
    // filterTasks(filterTasksDto: FilterTasksDto): Task[] {
    //     const { status, search } = filterTasksDto;
    //     const tasks = this.getAllTasks().filter(
    //         (task) =>
    //             task.status === status ||
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //     );
    //     return tasks;
    // }

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne(id);

        if (!task)
            throw new NotFoundException(`Task with id "${id}" not found`);

        return task;
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    // deleteTaskById(id: string): void {
    //     const taskToDelete = this.getTaskById(id);
    //     this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
    // }
    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
