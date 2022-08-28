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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../user.entity");
const typeorm_3 = require("typeorm");
let UserService = class UserService {
    constructor(userRepository, connection) {
        this.userRepository = userRepository;
        this.connection = connection;
    }
    async listUsers() {
        console.log("listUsers");
        return await this.userRepository.find();
    }
    async create(user) {
        console.log("create user");
        var email = user['email'];
        if (await this.isUserExists(email) == false) {
            return await this.userRepository.save(user);
        }
        else {
            return "user already exists with given email id";
        }
    }
    async update(user) {
        console.log("update user");
        var email = user['email'];
        var response = {};
        response['affected'] = 0;
        response['generatedMaps'] = [];
        response['raw'] = [];
        if (await this.isUserExists(email) == true) {
            var userId = await this.getUserIdByEmail(email);
            console.log("for update userId: " + userId);
            return await this.userRepository.update(userId, user);
        }
        return new typeorm_3.UpdateResult;
    }
    async delete(userId) {
        console.log("delete");
        var user = {};
        user['isActive'] = 0;
        return await this.userRepository.update(userId, user);
    }
    async getUserData(userId) {
        console.log("getUserData");
        return await this.userRepository.findOneBy(userId);
    }
    async isUserExists(email) {
        console.log("is User exists email id: " + email);
        var isUserExists = false;
        var userDetails = await this.connection.query("select userId from user where email = '" + email + "'");
        console.log(userDetails);
        if (userDetails.length == 1) {
            isUserExists = true;
        }
        return isUserExists;
    }
    async isUserExistsByUserId(userId) {
        console.log("userId: " + userId);
        var isUserExists = false;
        var userDetails = await this.connection.query("select userId from user where userId = '" + userId + "'");
        console.log(userDetails);
        if (userDetails.length == 1) {
            isUserExists = true;
        }
        return isUserExists;
    }
    async getUserIdByEmail(email) {
        console.log("User email id: " + email);
        var userDetails = await this.connection.query("select userId from user where email = '" + email + "'");
        console.log(userDetails);
        return userDetails[0]['userId'];
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectConnection)()),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Connection])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map