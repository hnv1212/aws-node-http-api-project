import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";

import { UserService } from "../service/userService";
import { ErrorResponse } from "app/utility/response";

const service = container.resolve(UserService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return service.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return service.UserLogin(event);
}).use(bodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.VerifyUser(event);
  } else if (httpMethod === "get") {
    return service.GetVerificationToken(event);
  } else {
    return ErrorResponse(404, "requested method is not supported");
  }
}).use(bodyParser());

export const Profile = middy((event: APIGatewayProxyEventV2) => {}).use(
  bodyParser()
);

export const Cart = middy((event: APIGatewayProxyEventV2) => {}).use(
  bodyParser()
);

export const Payment = middy((event: APIGatewayProxyEventV2) => {}).use(
  bodyParser()
);
