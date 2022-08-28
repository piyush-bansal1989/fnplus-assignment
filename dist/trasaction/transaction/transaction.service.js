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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const transaction_details_entity_1 = require("../transaction-details.entity");
const user_service_1 = require("../../user/user/user.service");
const user_accounts_service_1 = require("../../accounts/user-accounts/user-accounts.service");
let TransactionService = class TransactionService {
    constructor(transactionRepository, connection, userService, userAccountService, dataSource) {
        this.transactionRepository = transactionRepository;
        this.connection = connection;
        this.userService = userService;
        this.userAccountService = userAccountService;
        this.dataSource = dataSource;
    }
    async depositAmount(transactionData) {
        console.log("deposit amount");
        console.log(transactionData);
        var toAccountNumber = transactionData['toAccountNumber'];
        if (await this.userAccountService.isAccountExists(toAccountNumber) == false) {
            return "To account is not exists";
        }
        transactionData['isAddOrSubstract'] = 1;
        transactionData['type'] = 'Deposit';
        return await this.startTransaction(transactionData);
    }
    async withdrawAmount(transactionData) {
        var _a;
        console.log("withdraw/transfer amount");
        var fromAccountNumber = transactionData['fromAccountNumber'];
        var amount = transactionData['amount'];
        var isTransfer = (_a = transactionData['isTransfer']) !== null && _a !== void 0 ? _a : false;
        if (await this.userAccountService.isAccountExists(fromAccountNumber) == false) {
            return "from account is not exists";
        }
        if (await this.userAccountService.canWithdrawAmount(fromAccountNumber, amount) == false) {
            console.log("insufficient balance");
            return "Insufficient balance for withdrawl";
        }
        transactionData['isAddOrSubstract'] = 0;
        if (isTransfer == false) {
            transactionData['type'] = 'Withdraw';
        }
        return await this.startTransaction(transactionData);
    }
    async transferAmount(transactionData) {
        console.log("transfer amount");
        var fromAccountNumber = transactionData['fromAccountNumber'];
        var toAccountNumber = transactionData['toAccountNumber'];
        var amount = transactionData['amount'];
        var commission = 2;
        var response = {};
        if (await this.userAccountService.isAccountExists(fromAccountNumber) == false) {
            response['msg'] = "from account is not exists";
        }
        if (await this.userAccountService.isAccountExists(toAccountNumber) == false) {
            response['msg'] = "To account is not exists";
        }
        var commissionAmount = await this.getCommissionAmountOfTransfer(amount, commission);
        var finalAmountAfterCommission = amount + commissionAmount;
        if (await this.userAccountService.canWithdrawAmount(fromAccountNumber, finalAmountAfterCommission) == false) {
            console.log("insufficient balance after commission");
            response['msg'] = "Insufficient balance for transfer after adding the " + commission + "% commission";
        }
        if (response['msg'] != undefined && response['msg'] != "") {
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
        var data = [];
        data['accountNumber'] = toAccountNumber;
        data['amount'] = amount;
        data['isAddOrSubstract'] = 1;
        await this.userAccountService.updateCurrentBalance(data);
        var masterAccountDetails = await this.userAccountService.getMasterAccountDetails();
        var depositCommissionInMaster = [];
        depositCommissionInMaster['toAccountNumber'] = masterAccountDetails['accountNumber'];
        depositCommissionInMaster['fromAccountNumber'] = fromAccountNumber;
        depositCommissionInMaster['amount'] = commissionAmount;
        depositCommissionInMaster['transactionThrough'] = transactionData['transactionThrough'];
        depositCommissionInMaster['description'] = "commission";
        await this.depositAmount(depositCommissionInMaster);
        response['msg'] = "Transfer completed";
        return response;
    }
    async getCommissionAmountOfTransfer(amount, commission) {
        var commissionAmount = (commission / 100) * amount;
        console.log("commission ammount: " + commissionAmount);
        return commissionAmount;
    }
    async startTransaction(transactionData) {
        var _a, _b, _c, _d, _e, _f, _g;
        console.log("start transaction");
        console.log(transactionData);
        var fromAccountNumber = (_a = transactionData['fromAccountNumber']) !== null && _a !== void 0 ? _a : 0;
        var toAccountNumber = (_b = transactionData['toAccountNumber']) !== null && _b !== void 0 ? _b : 0;
        var amount = transactionData['amount'];
        var description = (_c = transactionData['description']) !== null && _c !== void 0 ? _c : "";
        var transactionThrough = transactionData['transactionThrough'];
        var isAddOrSubstract = transactionData['isAddOrSubstract'];
        var typeOfTransaction = transactionData['type'];
        var isInstersetAdded = (_d = transactionData['isInstersetAdded']) !== null && _d !== void 0 ? _d : 0;
        var percentageOfIntersetAdded = (_e = transactionData['percentageOfIntersetAdded']) !== null && _e !== void 0 ? _e : 0;
        var commissionAmount = (_f = transactionData['commissionAmout']) !== null && _f !== void 0 ? _f : 0;
        var totalAmountDedecuted = 0;
        if (typeOfTransaction == "Withdraw" || typeOfTransaction == "Transfer") {
            totalAmountDedecuted = (_g = transactionData['totalAmountDedecuted']) !== null && _g !== void 0 ? _g : amount;
        }
        var transactionDetails = new transaction_details_entity_1.TransactionDetails();
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
        if (typeOfTransaction == "Withdraw" || typeOfTransaction == "Transfer") {
            data['accountNumber'] = fromAccountNumber;
        }
        if (typeOfTransaction == "Withdraw") {
            data['amount'] = amount;
        }
        else if (typeOfTransaction == "Transfer") {
            data['amount'] = totalAmountDedecuted;
        }
        try {
            var transactionProgress = await queryRunner.manager.save(transactionDetails);
            var transactionId = transactionProgress['trasactionId'];
            var transactionStatus = [];
            transactionStatus['trasactionId'] = transactionId;
            transactionStatus['status'] = "Declined";
            if (await this.userAccountService.updateCurrentBalance(data)) {
                transactionStatus['status'] = "Completed";
                this.updateStatus(transactionStatus);
                await queryRunner.commitTransaction();
                if (typeOfTransaction == "Deposit") {
                    var msg = "Amount deposit successfully";
                }
                else if (typeOfTransaction == "Withdraw") {
                    var msg = "Amount Withdraw successfully";
                }
                else if (typeOfTransaction == "Transfer") {
                    var msg = "Amount Transffered successfully";
                }
                return msg;
            }
            else {
                if (typeOfTransaction == "Deposit") {
                    data['isAddOrSubstract'] = 0;
                }
                else if (typeOfTransaction == "Withdraw") {
                    data['isAddOrSubstract'] = 1;
                }
                else if (typeOfTransaction == "Transfer") {
                    data['isAddOrSubstract'] = 1;
                }
                this.userAccountService.updateCurrentBalance(data);
                return this.updateStatus(transactionStatus);
            }
        }
        catch (e) {
            console.log("CATCHING:");
            console.log(e);
            if (typeOfTransaction == "Deposit") {
                data['isAddOrSubstract'] = 0;
            }
            else if (typeOfTransaction == "Withdraw") {
                data['isAddOrSubstract'] = 1;
            }
            else if (typeOfTransaction == "Transfer") {
                data['isAddOrSubstract'] = 1;
            }
            this.userAccountService.updateCurrentBalance(data);
            return this.updateStatus(transactionStatus);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateStatus(data) {
        console.log("Updating status");
        console.log(data);
        var trasactionId = data['trasactionId'];
        var status = data['status'];
        return await this.connection.query("update transaction_details set status = '" + status + "' where trasactionId = '" + trasactionId + "'");
    }
};
TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(transaction_details_entity_1.TransactionDetails)),
    __param(1, (0, typeorm_2.InjectConnection)()),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Connection,
        user_service_1.UserService,
        user_accounts_service_1.UserAccountsService,
        typeorm_1.DataSource])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map