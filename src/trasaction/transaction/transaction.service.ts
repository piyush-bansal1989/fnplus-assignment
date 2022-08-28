import { Injectable } from '@nestjs/common';
import { Repository, Connection, DataSource } from 'typeorm';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { TransactionDetails } from '../transaction-details.entity';
import { UserService } from 'src/user/user/user.service';
import { UserAccountsService } from 'src/accounts/user-accounts/user-accounts.service';
import { threadId } from 'worker_threads';

@Injectable()
export class TransactionService {
    constructor(
		@InjectRepository(TransactionDetails)
		private transactionRepository: Repository<TransactionDetails>,
        @InjectConnection() private readonly connection: Connection,
        private userService: UserService,
        private userAccountService: UserAccountsService,
        private dataSource: DataSource
	){ }


    /*
    Deposit amount in the account, following data required in Post
    {
        "toAccountNumber": 9,
        "amount": 30000,
        "description": "self transfer",
        "transactionThrough": "ATM"
    }
    */
   async depositAmount(transactionData: any[]): Promise<any>{
    console.log("deposit amount");
    console.log(transactionData);
    var toAccountNumber = transactionData['toAccountNumber'];

    if (await this.userAccountService.isAccountExists(toAccountNumber) == false){
        return "To account is not exists";
    }

    transactionData['isAddOrSubstract'] = 1;
    transactionData['type'] = 'Deposit';
    
    return await this.startTransaction(transactionData);

   }

   /*
    Withdrawal amount from the account, following data required in Post
    {
        "fromAccountNumber": 3,
        "amount": 3500,
        "description": "self withdraw",
        "transactionThrough": "ATM"
    }
    */
   async withdrawAmount(transactionData: any[]): Promise<any>{
    console.log("withdraw/transfer amount")
    var fromAccountNumber = transactionData['fromAccountNumber'];
    var amount = transactionData['amount'];
    var isTransfer = transactionData['isTransfer'] ?? false;

    if (await this.userAccountService.isAccountExists(fromAccountNumber) == false){
        return "from account is not exists";
    }

    if (await this.userAccountService.canWithdrawAmount(fromAccountNumber, amount) == false){
        console.log("insufficient balance");
        return "Insufficient balance for withdrawl";
    }

    transactionData['isAddOrSubstract'] = 0;

    if (isTransfer == false){
        transactionData['type'] = 'Withdraw';
    }

    return await this.startTransaction(transactionData);

   }

   /*
    Transfer amount from one account to another account with some commission, following data required in Post
    {
        "fromAccountNumber": 3,
        "amount": 3500,
        "description": "self withdraw",
        "transactionThrough": "ATM"
    }
    */
   async transferAmount(transactionData: any[]): Promise<any>{
    console.log("transfer amount")
    var fromAccountNumber = transactionData['fromAccountNumber'];
    var toAccountNumber = transactionData['toAccountNumber'];
    var amount = transactionData['amount'];
    var commission = 2;
    var response ={};

    if (await this.userAccountService.isAccountExists(fromAccountNumber) == false){
        response['msg'] = "from account is not exists";
    }

    if (await this.userAccountService.isAccountExists(toAccountNumber) == false){
        response['msg'] = "To account is not exists";
    }

    var commissionAmount = await this.getCommissionAmountOfTransfer(amount, commission);
    var finalAmountAfterCommission = amount+commissionAmount;

    if (await this.userAccountService.canWithdrawAmount(fromAccountNumber, finalAmountAfterCommission) == false){
        console.log("insufficient balance after commission");
        response['msg'] = "Insufficient balance for transfer after adding the "+commission+"% commission";
    }

    if (response['msg']!= undefined && response['msg'] != ""){
        return response;
    }

    transactionData['amount'] = amount;
    transactionData['type'] = 'Transfer';
    transactionData['isInstersetAdded'] = 1;
    transactionData['percentageOfIntersetAdded'] = commission;
    transactionData['isTransfer'] = true;
    transactionData['commissionAmout'] = commissionAmount;
    transactionData['totalAmountDedecuted'] = finalAmountAfterCommission;
    await this.withdrawAmount(transactionData);

    // Update balance to whom balance transffered.
    var data = [];
    data['accountNumber'] = toAccountNumber;
    data['amount'] = amount;
    data['isAddOrSubstract'] = 1;
    await this.userAccountService.updateCurrentBalance(data);

    var masterAccountDetails = await this.userAccountService.getMasterAccountDetails();
    var depositCommissionInMaster = [];
    depositCommissionInMaster['toAccountNumber'] = masterAccountDetails['accountNumber'];
    depositCommissionInMaster['fromAccountNumber'] =  fromAccountNumber;
    depositCommissionInMaster['amount'] = commissionAmount;
    depositCommissionInMaster['transactionThrough'] = transactionData['transactionThrough'];
    depositCommissionInMaster['description'] = "commission";

    await this.depositAmount(depositCommissionInMaster);
    
    response['msg'] = "Transfer completed";
    
    return response;
   }

   async getCommissionAmountOfTransfer(amount: number, commission: number): Promise<number>{
    var commissionAmount = (commission/100) * amount;
    console.log("commission ammount: "+ commissionAmount);
    return commissionAmount;
   }

   async startTransaction(transactionData:any[]): Promise<any>{
    console.log("start transaction");
    console.log(transactionData);
    var fromAccountNumber = transactionData['fromAccountNumber'] ?? 0;
    var toAccountNumber = transactionData['toAccountNumber'] ?? 0;
    var amount = transactionData['amount'];
    var description = transactionData['description'] ?? "";
    var transactionThrough = transactionData['transactionThrough'];
    var isAddOrSubstract = transactionData['isAddOrSubstract'];
    var typeOfTransaction = transactionData['type'];
    var isInstersetAdded = transactionData['isInstersetAdded'] ?? 0;
    var percentageOfIntersetAdded = transactionData['percentageOfIntersetAdded'] ?? 0;
    var commissionAmount = transactionData['commissionAmout'] ?? 0;
    var totalAmountDedecuted = 0;

    if (typeOfTransaction == "Withdraw" || typeOfTransaction == "Transfer"){
        totalAmountDedecuted = transactionData['totalAmountDedecuted'] ?? amount;
    }

    var transactionDetails = new TransactionDetails();
    transactionDetails['fromAccountNumber'] = fromAccountNumber;
    transactionDetails['toAccountNumber'] = toAccountNumber;
    transactionDetails['amount'] = amount;
    transactionDetails['type'] = typeOfTransaction;
    transactionDetails['description'] = description;
    transactionDetails['transactionThrough'] = transactionThrough;
    transactionDetails['status'] = 'inProgress';
    transactionDetails['isInstersetAdded'] = isInstersetAdded;
    transactionDetails['percentageOfIntersetAdded'] = percentageOfIntersetAdded;
    transactionDetails['commissionAmount'] = commissionAmount;
    transactionDetails['totalAmountDedecuted'] = totalAmountDedecuted;


    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    var data = [];
    data['amount'] = amount;
    data['isAddOrSubstract'] = isAddOrSubstract;
    data['accountNumber'] = toAccountNumber;

    if (typeOfTransaction == "Withdraw" || typeOfTransaction == "Transfer"){
        data['accountNumber'] = fromAccountNumber;
    }

    if (typeOfTransaction == "Withdraw"){
        data['amount'] = amount;
    } else if (typeOfTransaction == "Transfer"){
        data['amount'] = totalAmountDedecuted;
    }
    
    try{
        //var transactionProgress = await this.transactionRepository.save(transactionDetails);
        var transactionProgress = await queryRunner.manager.save(transactionDetails);
        var transactionId = transactionProgress['trasactionId'];
 
        var transactionStatus =[];
        transactionStatus['trasactionId'] = transactionId;
        transactionStatus['status'] = "Declined";
 
        if (await this.userAccountService.updateCurrentBalance(data)){
         transactionStatus['status'] = "Completed";
         this.updateStatus(transactionStatus);
         await queryRunner.commitTransaction();

         if (typeOfTransaction == "Deposit"){
            var msg = "Amount deposit successfully";
         } else if (typeOfTransaction == "Withdraw"){
            var msg = "Amount Withdraw successfully";
         } else if (typeOfTransaction == "Transfer") {
            var msg = "Amount Transffered successfully";
         }

         return msg;
        } else {
            if (typeOfTransaction == "Deposit"){
                data['isAddOrSubstract'] = 0;
            } else if (typeOfTransaction == "Withdraw"){
                data['isAddOrSubstract'] = 1;
            } else if (typeOfTransaction == "Transfer") {
                data['isAddOrSubstract'] = 1;
            }

            this.userAccountService.updateCurrentBalance(data);
            return this.updateStatus(transactionStatus);
        }
     } catch(e){
         console.log("CATCHING:");
         console.log(e);
         if (typeOfTransaction == "Deposit"){
            data['isAddOrSubstract'] = 0;
         } else if (typeOfTransaction == "Withdraw"){
            data['isAddOrSubstract'] = 1;
         } else if (typeOfTransaction == "Transfer") {
            data['isAddOrSubstract'] = 1;
         }
         
         this.userAccountService.updateCurrentBalance(data);
         return this.updateStatus(transactionStatus);
         await queryRunner.rollbackTransaction();
     } finally {
        await queryRunner.release();
    }

   }

   async updateStatus(data: any[]): Promise<any>{
    console.log("Updating status");
    console.log(data);
    var trasactionId = data['trasactionId'];
    var status = data['status'];
    return await this.connection.query("update transaction_details set status = '"+status+"' where trasactionId = '"+trasactionId+"'");
   }

}
