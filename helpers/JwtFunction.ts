import { requireEnv, Generate } from "../";

import * as jwt from "jsonwebtoken";

const tokenList: any = {}; // save all token register

export const JwtFunction = {
  CreateTokenLogin: (
    value: object,
    expired_token: number | string,
    expired_refresh_token: number,
    notSaved = false
  ) => {
    const JWT_SECRET_TOKEN: any = requireEnv(
      "JWT_SECRET_TOKEN",
      Generate.random.HEX()
    );
    const JWT_SECRET_REFRESH_TOKEN: any = requireEnv(
      "JWT_SECRET_REFRESH_TOKEN",
      Generate.random.HEX()
    );

    const token = jwt.sign(value, JWT_SECRET_TOKEN, {
      expiresIn:
        typeof expired_token === "string"
          ? parseInt(expired_token)
          : expired_token,
    });
    const refresh_token = jwt.sign(value, JWT_SECRET_REFRESH_TOKEN, {
      expiresIn:
        typeof expired_refresh_token === "string"
          ? parseInt(expired_refresh_token)
          : expired_refresh_token,
    });

    const response = {
      token,
      expired_token,
      refresh_token,
    };

    if (!notSaved) {
      tokenList[refresh_token] = {
        value,
        ...response,
      };
    }
    return response;
  },
  UpdateToken: (refresh_token: string, expired_token: number) => {
    const JWT_SECRET_TOKEN: any = requireEnv(
      "JWT_SECRET_TOKEN",
      Generate.random.HEX()
    );

    if (refresh_token in tokenList) {
      const new_token = jwt.sign(
        tokenList[refresh_token].value,
        JWT_SECRET_TOKEN,
        {
          expiresIn:
            typeof expired_token === "string"
              ? parseInt(expired_token)
              : expired_token,
        }
      );
      tokenList[refresh_token].token = new_token; // refresh
      return new_token;
    }
    return false;
  },
  GenerateSingleToken: (value: object | string, expired_token: number) => {
    const JWT_SECRET_TOKEN: any = requireEnv(
      "JWT_SECRET_TOKEN",
      Generate.random.HEX()
    );

    return jwt.sign(value, JWT_SECRET_TOKEN, {
      expiresIn:
        typeof expired_token === "string"
          ? parseInt(expired_token)
          : expired_token,
    });
  },
};
