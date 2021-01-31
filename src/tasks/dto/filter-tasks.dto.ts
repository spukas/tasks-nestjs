import { TaskStatus } from '../task-status.enum';

export class FilterTasksDto {
    status: TaskStatus;
    search: string;
}
