import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthCredentialsDto } from '../../src/auth/dto/auth-credentials.dto';
import { UserRepository } from '../../src/auth/user.repository';

const mockAuthCredentialsDto: AuthCredentialsDto = {
    username: 'TestUser',
    password: 'TestPassword',
};

describe('UserRepositoru', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('SignUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        test('should signup by creating and saving a new user', () => {
            save.mockResolvedValue(1);
            expect(
                userRepository.signUp(mockAuthCredentialsDto),
            ).resolves.not.toThrow();
            expect(userRepository.create).toHaveBeenCalled();
        });

        // TODO: fix unhandled promise rejection
        test('should throw conflict exception if username exist', () => {
            save.mockRejectedValue({ code: '23505' });
            expect(
                userRepository.signUp(mockAuthCredentialsDto),
            ).rejects.toThrow(ConflictException);
        });

        // TODO: fix unhandled promise rejection
        test('should throw internal server error', () => {
            save.mockRejectedValue(undefined);
            expect(
                userRepository.signUp(mockAuthCredentialsDto),
            ).rejects.toThrow(InternalServerErrorException);
        });
    });
});
