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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const class_transformer_1 = require("class-transformer");
const userRepository_1 = require("../repository/userRepository");
const response_1 = require("../utility/response");
const tsyringe_1 = require("tsyringe");
const errors_1 = require("../utility/errors");
const password_1 = require("../utility/password");
const SignupInput_1 = require("../models/dto/SignupInput");
let UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    CreateUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(SignupInput_1.SignupInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                const salt = yield (0, password_1.GenSalt)();
                const hashedPassword = yield (0, password_1.GetHashedPassword)(input.password, salt);
                const data = yield this.repository.createAccount({
                    email: input.email,
                    password: hashedPassword,
                    phone: input.phone,
                    userType: "BUYER",
                    salt: salt,
                });
                return (0, response_1.SuccessResponse)(data);
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    UserLogin(event) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [userRepository_1.UserRepository])
], UserService);
//# sourceMappingURL=userService.js.map