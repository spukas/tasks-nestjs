import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UserRepository, useFactory: mockUserRepository },
            ],
        }).compile();

        jwtStrategy = moduleRef.get<JwtStrategy>(JwtStrategy);
        userRepository = moduleRef.get<UserRepository>(UserRepository);
    });

    describe('validate', () => {
        test('should return user based on jwt payload', async () => {
            const user = new User();
            user.username = 'testUser';
            jest.spyOn(userRepository, 'findOne').mockImplementation(() =>
                Promise.resolve(user),
            );
            const result = await jwtStrategy.validate({ username: 'testUser' });
            expect(userRepository.findOne).toHaveBeenCalledWith({
                username: 'testUser',
            });
            expect(result).toEqual(user);
        });

        test('should throw exception is user was not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockImplementation(
                () => null,
            );
            await expect(
                jwtStrategy.validate({ username: 'undefined' }),
            ).rejects.toThrow(UnauthorizedException);
            expect(userRepository.findOne).toHaveBeenCalledWith({
                username: 'undefined',
            });
        });
    });
});
