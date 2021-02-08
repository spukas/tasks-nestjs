import { Test } from '@nestjs/testing';
import { FilterTasksDto } from '../../src/tasks/dto/filter-tasks.dto';
import { TaskStatus } from '../../src/tasks/task-status.enum';
import { TaskRepository } from '../../src/tasks/task.repository';
import { TasksService } from '../../src/tasks/tasks.service';

const mockTaskRepository = () => ({
    getAllTasks: jest.fn(),
});

const user = { username: 'User1' };

describe('TaskService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getAllTasks', () => {
        test('should get all tasks from repository', async () => {
            taskRepository.getAllTasks.mockResolvedValue('returnValue');
            const filters: FilterTasksDto = {
                status: TaskStatus.DONE,
                search: '',
            };
            expect(taskRepository.getAllTasks).not.toHaveBeenCalled();
            const result = await tasksService.getAllTasks(filters, user);
            expect(taskRepository.getAllTasks).toHaveBeenCalled();
            expect(result).toEqual('returnValue');
        });
    });
});
