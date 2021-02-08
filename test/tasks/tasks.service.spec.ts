import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';
import { FilterTasksDto } from '../../src/tasks/dto/filter-tasks.dto';
import { TaskStatus } from '../../src/tasks/task-status.enum';
import { TaskRepository } from '../../src/tasks/task.repository';
import { TasksService } from '../../src/tasks/tasks.service';

const mockTaskRepository = () => ({
    getAllTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
});

const mockUser = { id: 5, username: 'User1' };

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
            const result = await tasksService.getAllTasks(filters, mockUser);
            expect(taskRepository.getAllTasks).toHaveBeenCalled();
            expect(result).toEqual('returnValue');
        });
    });

    describe('getTaskById', () => {
        test('should call taskRepository.findOne() and return task', async () => {
            const mockTask = {
                id: 1,
                title: 'Test title',
                description: 'Test description',
            };
            taskRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById(1, mockUser);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1, userId: mockUser.id },
            });
            expect(result).toBe(mockTask);
        });

        test('should throw exception if task not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(2, mockUser)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('createTask', () => {
        test('should call taskRepository.createTask() and create a task', async () => {
            const mockTask: CreateTaskDto = {
                title: 'Test title',
                description: 'Test description',
            };
            taskRepository.createTask.mockResolvedValue({ id: 1, ...mockTask });
            const result = await tasksService.createTask(mockTask, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ id: 1, ...mockTask });
        });
    });
});
