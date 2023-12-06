"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.Cart = exports.Profile = exports.Verify = exports.Login = exports.Signup = void 0;
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const tsyringe_1 = require("tsyringe");
const userService_1 = require("../service/userService");
const service = tsyringe_1.container.resolve(userService_1.UserService);
exports.Signup = (0, core_1.default)((event) => {
    return service.CreateUser(event);
}).use((0, http_json_body_parser_1.default)());
exports.Login = (0, core_1.default)((event) => { }).use((0, http_json_body_parser_1.default)());
const Verify = () => { };
exports.Verify = Verify;
const Profile = () => { };
exports.Profile = Profile;
const Cart = () => { };
exports.Cart = Cart;
const Payment = () => { };
exports.Payment = Payment;
//# sourceMappingURL=userHandler.js.map