import { Repository, Connection, DataSource } from 'typeorm';
import { AccountDetails } from '../user-account.entity';
import { UserService } from 'src/user/user/user.service';
export declare class UserAccountsService {
    private accountRepository;
    private readonly connection;
    private userService;
    private dataSource;
    constructor(accountRepository: Repository<AccountDetails>, connection: Connection, userService: UserService, dataSource: DataSource);
    userAccountDetails(requestData: string): Promise<any>;
    createAccount(accountDetails: AccountDetails): Promise<any>;
    getUserAccountDetails(userId: number): Promise<any>;
    isAccountExists(accountId: number): Promise<boolean>;
    getCurrentBalance(accountId: number): Promise<any>;
    updateCurrentBalance(data: any[]): Promise<boolean>;
    canWithdrawAmount(accountId: number, amount: number): Promise<boolean>;
    getMasterAccountDetails(): Promise<any>;
}
