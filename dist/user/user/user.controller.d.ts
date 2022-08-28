import { User } from '../user.entity';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    index(res: any): Promise<User[]>;
    create(res: any, userData: User): Promise<any>;
    update(res: any, userData: User): Promise<any>;
    delete(res: any, userData: number): Promise<any>;
    getUserData(res: any, userData: User): Promise<any>;
}
