import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
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
    // getTaskById(id: string): Task {
    //     const task = this.tasks.find((task) => task.id === id);
    //     if (!task) throw new NotFoundException(`Task with id: ${id} not found`);
    //     return task;
    // }
    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuidv1(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };
    //     this.tasks.push(task);
    //     return task;
    // }
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
