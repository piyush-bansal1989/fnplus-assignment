import { AccountDetails } from '../user-account.entity';
import { UserAccountsService } from './user-accounts.service';
export declare class UserAccountsController {
    private userAccountService;
    constructor(userAccountService: UserAccountsService);
    index(res: any, userId: string): Promise<any>;
    create(res: any, userData: AccountDetails): Promise<any>;
}
