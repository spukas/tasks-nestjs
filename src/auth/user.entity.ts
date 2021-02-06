import * as bcrypt from 'bcrypt';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    async isPasswordValid(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);

        return this.password === hash;
    }
}
