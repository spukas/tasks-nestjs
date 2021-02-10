import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
    getAllTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
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

        tasksService = module.get<TasksService>(TasksService);
        taskRepository = module.get<TaskRepository>(TaskRepository);
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

    describe('deleteTaskById', () => {
        test('should call taskRepository.delete() and delete a task', () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });

            tasksService.deleteTaskById(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({
                id: 1,
                userId: mockUser.id,
            });
        });

        test('should throw NotFoundException error if task not found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(
                NotFoundException,
            );
            expect(taskRepository.delete).toHaveBeenCalledWith({
                id: 1,
                userId: mockUser.id,
            });
        });
    });
});
