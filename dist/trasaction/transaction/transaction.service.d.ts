import { Repository, Connection, DataSource } from 'typeorm';
import { TransactionDetails } from '../transaction-details.entity';
import { UserService } from 'src/user/user/user.service';
import { UserAccountsService } from 'src/accounts/user-accounts/user-accounts.service';
export declare class TransactionService {
    private transactionRepository;
    private readonly connection;
    private userService;
    private userAccountService;
    private dataSource;
    constructor(transactionRepository: Repository<TransactionDetails>, connection: Connection, userService: UserService, userAccountService: UserAccountsService, dataSource: DataSource);
    depositAmount(transactionData: any[]): Promise<any>;
    withdrawAmount(transactionData: any[]): Promise<any>;
    transferAmount(transactionData: any[]): Promise<any>;
    getCommissionAmountOfTransfer(amount: number, commission: number): Promise<number>;
    startTransaction(transactionData: any[]): Promise<any>;
    updateStatus(data: any[]): Promise<any>;
}
