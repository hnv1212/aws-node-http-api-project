import { plainToClass } from "class-transformer";
import { UserRepository } from "../repository/userRepository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { LoginInput } from "app/models/dto/LoginInput";
import { AppValidationError } from "../utility/errors";
import {
  GenSalt,
  GetHashedPassword,
  GetToken,
  ValidatePassword,
  VerifyToken,
} from "../utility/password";
import { SignupInput } from "../models/dto/SignupInput";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "app/utility/notification";
import { VerificationInput } from "app/models/dto/UpdateInput";
import { TimeDifference } from "app/utility/dateHelper";

@autoInjectable()
export class UserService {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const salt = await GenSalt();
      const hashedPassword = await GetHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        userType: "BUYER",
        salt: salt,
      });

      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const data = await this.repository.findAccount(input.email);
      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );
      if (!verified) {
        throw new Error("password does not match!");
      }

      const token = GetToken(data);

      return SuccessResponse({ token });
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await VerifyToken(token);

    if (!payload) return ErrorResponse(403, "authorization failed!");

    const { code, expiry } = GenerateAccessCode();
    // save on DB to confirm verification
    await this.repository.updateVerificationCode(payload.user_id, code, expiry);
    // await SendVerificationCode(code, payload.phone);
    return SuccessResponse({
      message: "verification code is sent to your registered mobile number!",
    });
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await VerifyToken(token)
    if(!payload) return ErrorResponse(404, "authorization failed!")

    const input = plainToClass(VerificationInput, event.body)
    const error = await AppValidationError(input)
    if(error) return ErrorResponse(404, error)

    const { verification_code, expiry} = await this.repository.findAccount(payload.email)
    // find the user account
    if(verification_code === parseInt(input.code)) {
      // check expiry
      const currentTime = new Date()
      const diff = TimeDifference(expiry, currentTime.toISOString(), "m")
      if(diff > 0) {
        await this.repository.updateVerifyUser(payload.user_id)
      } else {
        return ErrorResponse(403, "verification code is expired!")
      }
    }

    return SuccessResponse({ message: "user verified!" });
  }
}
