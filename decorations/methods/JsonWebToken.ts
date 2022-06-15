import { Request, Response } from "express";
import { Generate, StatusCode, requireEnv } from "../../";

import * as jwt from "jsonwebtoken";
import { ParsedQs } from "qs";

export const Jwt = (isAdmin = false): MethodDecorator => {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // require !!!
    const JWT_SECRET_TOKEN = requireEnv(
      "JWT_SECRET_TOKEN",
      Generate.random.HEX()
    );

    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const request = args[0] as Request;
      const response = args[1] as Response;
      const next = () => {
        return original.apply(this, args);
      };
      function negativeResponse(code: number, message: string) {
        return response.status(code).json({ message });
      }
      function isBearer(
        value: string | ParsedQs | string[] | ParsedQs[] | undefined
      ) {
        return value !== undefined && String(value).startsWith("Bearer ")
          ? String(value).split(" ")[1]
          : false;
      }

      const token =
        isBearer(request.headers.authentication) ||
        isBearer(request.headers.authorization) ||
        isBearer(request.headers["x-access-token"]) ||
        isBearer(request.body.token) ||
        isBearer(request.query.token);

      if (token) {
        // Use JWT Function (start)
        return jwt.verify(
          token,
          String(JWT_SECRET_TOKEN),
          (err, user_decoded: any) => {
            if (err) {
              return negativeResponse(
                StatusCode.negative.client.UNAUTHORIZED,
                "Not Authorized"
              );
            } else {
              const now_admin =
                user_decoded?.admin ||
                user_decoded?.isAdmin ||
                user_decoded?.is_admin ||
                false;
              if (isAdmin && !now_admin) {
                return negativeResponse(
                  StatusCode.negative.client.NOT_ACCEPTABLE,
                  "Only Admin can Login"
                );
              }
              args[0].jwt = user_decoded;
              return next();
            }
          }
        );
        // Use JWT Function (stop)
      } else {
        return negativeResponse(
          StatusCode.negative.client.FORBIDDEN,
          "Authorization Bearer is required!"
        );
      }
    };
  };
};
