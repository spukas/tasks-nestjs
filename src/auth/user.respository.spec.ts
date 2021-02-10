import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockAuthCredentialsDto: AuthCredentialsDto = {
    username: 'TestUser',
    password: 'TestPassword',
};

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UserRepository],
        }).compile();

        userRepository = moduleRef.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let user;

        beforeEach(() => {
            user = new User();
            user.save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue(user);
        });

        test('should create and save user', async () => {
            await userRepository.signUp(mockAuthCredentialsDto);
            expect(userRepository.create).toHaveBeenCalled();
            expect(user.save).toHaveBeenCalled();
        });

        test('should throw conflict error if username exsist', async () => {
            user.save.mockRejectedValue({ code: '23505' });
            try {
                await userRepository.signUp(mockAuthCredentialsDto);
            } catch (error) {
                expect(error).toEqual(
                    new ConflictException('Username already exsists'),
                );
            }
        });

        test('should throw internal server error if user saving fails', async () => {
            user.save.mockRejectedValue({ code: 'anything' });
            try {
                await userRepository.signUp(mockAuthCredentialsDto);
            } catch (error) {
                expect(error).toEqual(new InternalServerErrorException());
            }
        });
    });

    describe('SignIn', () => {
        let user;
        beforeEach(() => {
            user = new User();
            user.username = 'TestUser';
        });
        test('should return username if user found and password valid', async () => {
            jest.spyOn(userRepository, 'findOne').mockImplementation(
                () => user,
            );
            jest.spyOn(user, 'isPasswordValid').mockImplementation(() => true);

            const result = await userRepository.signIn(mockAuthCredentialsDto);

            expect(userRepository.findOne).toHaveBeenCalled();
            expect(user.isPasswordValid).toHaveBeenCalled();
            expect(result).toEqual('TestUser');
        });

        test('should return null if user not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockImplementation(
                () => null,
            );
            jest.spyOn(user, 'isPasswordValid').mockImplementation(() => true);
            const result = await userRepository.signIn(mockAuthCredentialsDto);
            expect(result).toEqual(null);
        });

        test('should return null if user found but password is not valid', async () => {
            jest.spyOn(userRepository, 'findOne').mockImplementation(
                () => user,
            );
            jest.spyOn(user, 'isPasswordValid').mockImplementation(() => false);
            const result = await userRepository.signIn(mockAuthCredentialsDto);
            expect(result).toEqual(null);
        });
    });
});
