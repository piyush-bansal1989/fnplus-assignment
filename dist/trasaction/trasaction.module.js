"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrasactionModule = void 0;
const common_1 = require("@nestjs/common");
const transaction_controller_1 = require("./transaction/transaction.controller");
const transaction_service_1 = require("./transaction/transaction.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("../user/user.module");
const accounts_module_1 = require("../accounts/accounts.module");
const transaction_details_entity_1 = require("./transaction-details.entity");
let TrasactionModule = class TrasactionModule {
};
TrasactionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_details_entity_1.TransactionDetails]),
            user_module_1.UserModule,
            accounts_module_1.AccountsModule
        ],
        controllers: [transaction_controller_1.TransactionController],
        providers: [transaction_service_1.TransactionService],
    })
], TrasactionModule);
exports.TrasactionModule = TrasactionModule;
//# sourceMappingURL=trasaction.module.js.map