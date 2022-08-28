"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_account_entity_1 = require("../user-account.entity");
const user_service_1 = require("../../user/user/user.service");
let UserAccountsService = class UserAccountsService {
    constructor(accountRepository, connection, userService, dataSource) {
        this.accountRepository = accountRepository;
        this.connection = connection;
        this.userService = userService;
        this.dataSource = dataSource;
    }
    async userAccountDetails(requestData) {
        console.log("account details");
        var userId = requestData['userId'];
        let userAccountDetails = await this.getUserAccountDetails(userId);
        console.log(userAccountDetails);
        if (userAccountDetails.length > 0) {
            return userAccountDetails;
        }
        else {
            return "account not found for the current user";
        }
    }
    async createAccount(accountDetails) {
        console.log("create account");
        var userId = accountDetails['userId'];
        if (await this.userService.isUserExistsByUserId(userId)) {
            accountDetails['currentBalance'] = accountDetails['openingBalance'];
            return await this.accountRepository.save(accountDetails);
        }
        else {
            return "invalid user";
        }
    }
    async getUserAccountDetails(userId) {
        console.log(userId);
        var accountDetails = await this.connection.query("select * from account_details where userId = '" + userId + "'");
        console.log(accountDetails);
        return accountDetails;
    }
    async isAccountExists(accountId) {
        var accountDetails = await this.connection.query("select accountNumber from account_details where accountNumber = '" + accountId + "'");
        if (accountDetails.length > 0) {
            return true;
        }
        return false;
    }
    async getCurrentBalance(accountId) {
        console.log("get current balance");
        var currentBalance = await this.connection.query("select currentBalance from account_details where accountNumber = '" + accountId + "'");
        console.log("current balance");
        console.log(currentBalance);
        return currentBalance[0]['currentBalance'];
    }
    async updateCurrentBalance(data) {
        var accountNumber = data['accountNumber'];
        var amount = data['amount'];
        var isAddOrSubstract = data['isAddOrSubstract'];
        var currentBalance = await this.getCurrentBalance(accountNumber);
        var isbalanceUpdated = false;
        if (isAddOrSubstract == 1) {
            var updatedBalance = currentBalance + amount;
        }
        else {
            var updatedBalance = currentBalance - amount;
        }
        console.log("updated balance " + updatedBalance);
        isbalanceUpdated = await this.connection.query("update account_details set currentBalance = '" + updatedBalance + "' where accountNumber = '" + accountNumber + "'");
        console.log("isBalanceupdated: ");
        if (isbalanceUpdated['affectedRows'] == 1) {
            return true;
        }
        return false;
    }
    async canWithdrawAmount(accountId, amount) {
        console.log("checking is amount withdrawable from account id: " + accountId);
        var isAmountWithdrable = false;
        var currentBalance = await this.getCurrentBalance(accountId);
        var balance = currentBalance - amount;
        console.log(currentBalance);
        console.log(amount);
        console.log("balance after widhdrawl: " + balance);
        if (balance > 0) {
            isAmountWithdrable = true;
        }
        console.log("isAmountWithdrable: " + isAmountWithdrable);
        return isAmountWithdrable;
    }
    async getMasterAccountDetails() {
        var masterAccountDetails = await this.connection.query("select * from account_details where userType = 'master'");
        return masterAccountDetails[0];
    }
};
UserAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_account_entity_1.AccountDetails)),
    __param(1, (0, typeorm_2.InjectConnection)()),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Connection,
        user_service_1.UserService,
        typeorm_1.DataSource])
], UserAccountsService);
exports.UserAccountsService = UserAccountsService;
//# sourceMappingURL=user-accounts.service.js.map