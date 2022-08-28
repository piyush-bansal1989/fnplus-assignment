import { Injectable } from '@nestjs/common';
import { Repository, Connection, DataSource, QueryRunner } from 'typeorm';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { AccountDetails } from '../user-account.entity';
import { UserService } from 'src/user/user/user.service';

@Injectable()
export class UserAccountsService {

    constructor(
		@InjectRepository(AccountDetails)
		private accountRepository: Repository<AccountDetails>,
        @InjectConnection() private readonly connection: Connection,
        private userService: UserService,
        private dataSource: DataSource
	){ }

    /*
    Fetching user accounts detail using userId
    */
   async userAccountDetails(requestData: string) : Promise<any>{
    console.log("account details");
    var userId = requestData['userId'];

    let userAccountDetails = await this.getUserAccountDetails(userId);
    console.log(userAccountDetails);
    
    if (userAccountDetails.length>0){
        return userAccountDetails;
    } else {
        return "account not found for the current user";
    }
   }

   /*
    Creating user account detail of registerd user.
    */
   async  createAccount(accountDetails: AccountDetails): Promise<any> {
        console.log("create account");
        var userId = accountDetails['userId'];
        if (await this.userService.isUserExistsByUserId(userId) ){
            accountDetails['currentBalance'] = accountDetails['openingBalance'];
            return await this.accountRepository.save(accountDetails);
        } else {
            return "invalid user";
        }
    }

    /*
    Fetching user account details using user id.
    */
   async getUserAccountDetails(userId: number): Promise<any>{
     console.log(userId);
     var accountDetails = await this.connection.query("select * from account_details where userId = '"+userId+"'");
     console.log(accountDetails);

     return accountDetails;
    }

    /*
    Chekcing is account exists using account id.
    */
    async isAccountExists(accountId: number): Promise<boolean>{
        var accountDetails = await this.connection.query("select accountNumber from account_details where accountNumber = '"+accountId+"'");

        if (accountDetails.length>0){
            return true;
        }

        return false;
    }

    /*
    Fetching current balance of the account using accountId.
    */
    async getCurrentBalance(accountId: number,): Promise<any>{
        console.log("get current balance");
        var currentBalance = await this.connection.query("select currentBalance from account_details where accountNumber = '"+accountId+"'");
        console.log("current balance");
        console.log(currentBalance);
        return currentBalance[0]['currentBalance'];
    }

    /*
    Updating current balance of the account.
    */
    async updateCurrentBalance(data: any[]): Promise<boolean>{
        var accountNumber = data['accountNumber'];
        var amount = data['amount'];
        var isAddOrSubstract = data['isAddOrSubstract'];
        var currentBalance = await this.getCurrentBalance(accountNumber);
        var isbalanceUpdated = false;
        
        if (isAddOrSubstract == 1){
            var updatedBalance = currentBalance + amount;
        } else {
            var updatedBalance = currentBalance - amount;
        }

        console.log("updated balance "+ updatedBalance);
        isbalanceUpdated = await this.connection.query("update account_details set currentBalance = '"+ updatedBalance+"' where accountNumber = '"+accountNumber+"'");
        console.log("isBalanceupdated: ");
        
        if (isbalanceUpdated['affectedRows'] == 1){
            return true;
        }

        return false;
    }

    /*
    Checking user has suffiencient balance in account for withdrawal
    */
   async canWithdrawAmount(accountId:number, amount:number): Promise<boolean>{
    console.log("checking is amount withdrawable from account id: "+ accountId);
    var isAmountWithdrable = false;
    var currentBalance = await this.getCurrentBalance(accountId);
    var balance = currentBalance - amount;
    console.log(currentBalance);
    console.log(amount);
    console.log("balance after widhdrawl: " + balance);

    if (balance > 0){
        isAmountWithdrable =  true;
    }

    console.log("isAmountWithdrable: "+isAmountWithdrable);
    return isAmountWithdrable;
   }

   /*
    Fetching master account details
    */
   async getMasterAccountDetails(): Promise<any>{
    var masterAccountDetails = await this.connection.query("select * from account_details where userType = 'master'");
    return masterAccountDetails[0];
   }
}
