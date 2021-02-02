import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getAllTasks(filterTasksDto: FilterTasksDto): Promise<Task[]> {
        const { status, search } = filterTasksDto;

        const tasks = await this.createQueryBuilder('task');

        if (status)
            tasks.where('task.status = :status', {
                status: status.toUpperCase(),
            });

        if (search)
            tasks.where(
                'task.title ILIKE :search OR task.description ILIKE :search',
                { search: `%${search}%` },
            );

        return tasks.getMany();
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }
}
