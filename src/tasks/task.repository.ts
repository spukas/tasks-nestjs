import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getAllTasks(
        filterTasksDto: FilterTasksDto,
        user: User,
    ): Promise<Task[]> {
        const { status, search } = filterTasksDto;

        const tasks = await this.createQueryBuilder('task');

        tasks.where('task.userId = :userId', { userId: user.id });

        if (status)
            tasks.andWhere('task.status = :status', {
                status: status.toUpperCase(),
            });

        if (search)
            tasks.andWhere(
                'task.title ILIKE :search OR task.description ILIKE :search',
                { search: `%${search}%` },
            );

        try {
            return await tasks.getMany();
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for user "${
                    user.username
                }". Filter: ${JSON.stringify(filterTasksDto)}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
        } catch (error) {
            this.logger.error(
                `Failed to save task for user "${
                    user.username
                }". Task: ${JSON.stringify(createTaskDto)}`,
                error.stack,
            );
        }

        // Return task to client without user field
        delete task.user;
        return task;
    }
}
