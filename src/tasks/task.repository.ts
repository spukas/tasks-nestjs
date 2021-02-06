import { User } from 'src/auth/user.entity';
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

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();

        // Return task to client without user field
        delete task.user;
        return task;
    }
}
