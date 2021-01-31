import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: string): string {
        const transformedValue = value.toLocaleUpperCase();

        if (!this.isValid(transformedValue))
            throw new BadRequestException(
                `Status "${transformedValue}" is not valid`,
            );

        return transformedValue;
    }

    private isValid(value: string): boolean {
        return this.allowedStatus.findIndex((status) => status === value) >= 0;
    }
}
