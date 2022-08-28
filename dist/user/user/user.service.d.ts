import { Repository, Connection } from 'typeorm';
import { User } from '../user.entity';
import { UpdateResult } from 'typeorm';
export declare class UserService {
    private userRepository;
    private readonly connection;
    constructor(userRepository: Repository<User>, connection: Connection);
    listUsers(): Promise<any>;
    create(user: User): Promise<any>;
    update(user: User): Promise<UpdateResult>;
    delete(userId: number): Promise<UpdateResult>;
    getUserData(userId: User): Promise<any>;
    isUserExists(email: string): Promise<boolean>;
    isUserExistsByUserId(userId: number): Promise<boolean>;
    getUserIdByEmail(email: string): Promise<any>;
}
