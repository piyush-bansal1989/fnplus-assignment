import { TransactionService } from './transaction.service';
export declare class TransactionController {
    private transactionService;
    constructor(transactionService: TransactionService);
    deposit(res: any, requestData: any[]): Promise<any>;
    withdraw(res: any, requestData: any[]): Promise<any>;
    transfer(res: any, requestData: any[]): Promise<any>;
}
