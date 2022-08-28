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
exports.UserAccountsController = void 0;
const common_1 = require("@nestjs/common");
const user_account_entity_1 = require("../user-account.entity");
const user_accounts_service_1 = require("./user-accounts.service");
const common_2 = require("@nestjs/common");
let UserAccountsController = class UserAccountsController {
    constructor(userAccountService) {
        this.userAccountService = userAccountService;
    }
    async index(res, userId) {
        const response = await this.userAccountService.userAccountDetails(userId);
        return res.status(common_2.HttpStatus.OK).json({
            message: "user account details",
            data: response,
            status: "success"
        });
    }
    async create(res, userData) {
        const response = await this.userAccountService.createAccount(userData);
        return res.status(common_2.HttpStatus.OK).json({
            message: "user account details",
            data: response,
            status: "success"
        });
    }
};
__decorate([
    (0, common_2.Get)(),
    __param(0, (0, common_2.Res)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserAccountsController.prototype, "index", null);
__decorate([
    (0, common_2.Post)('create-account'),
    __param(0, (0, common_2.Res)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_account_entity_1.AccountDetails]),
    __metadata("design:returntype", Promise)
], UserAccountsController.prototype, "create", null);
UserAccountsController = __decorate([
    (0, common_1.Controller)('user-accounts'),
    __metadata("design:paramtypes", [user_accounts_service_1.UserAccountsService])
], UserAccountsController);
exports.UserAccountsController = UserAccountsController;
//# sourceMappingURL=user-accounts.controller.js.map