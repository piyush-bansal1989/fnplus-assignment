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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user.entity");
const user_service_1 = require("./user.service");
const common_2 = require("@nestjs/common");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async index(res) {
        const response = await this.userService.listUsers();
        return res.status(common_2.HttpStatus.OK).json({
            message: "list of all users",
            data: response,
            status: "success"
        });
    }
    async create(res, userData) {
        const response = await this.userService.create(userData);
        return res.status(common_2.HttpStatus.OK).json({
            message: "user created",
            data: response,
            status: "success"
        });
    }
    async update(res, userData) {
        const response = await this.userService.update(userData);
        var msg = "Details not updated";
        if (response['affected'] == 1) {
            msg = "User details updated";
        }
        return res.status(common_2.HttpStatus.OK).json({
            message: msg,
            data: response,
            status: "success"
        });
    }
    async delete(res, userData) {
        const response = await this.userService.delete(userData);
        return res.status(common_2.HttpStatus.OK).json({
            message: "user deactivated",
            data: response,
            status: "success"
        });
    }
    async getUserData(res, userData) {
        const response = await this.userService.getUserData(userData);
        return res.status(common_2.HttpStatus.OK).json({
            message: "user detail",
            data: response,
            status: "success"
        });
    }
};
__decorate([
    (0, common_2.Get)(),
    __param(0, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "index", null);
__decorate([
    (0, common_2.Post)('create'),
    __param(0, (0, common_2.Res)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_2.Post)('update'),
    __param(0, (0, common_2.Res)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_2.Post)('delete'),
    __param(0, (0, common_2.Res)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_2.Get)('get-user-info'),
    __param(0, (0, common_2.Res)()),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserData", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map