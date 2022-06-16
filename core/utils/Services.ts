import { StatusCode, Logger } from "..";

interface ErrorMessage {
  message: string;
  stack: string;
}

export const Services = {
  Response: {
    Success: (
      message_data:
        | string
        | number
        | boolean
        | object
        | string[]
        | number[]
        | object[],
      status = "success",
      code: number = StatusCode.positive.success.OK,
      logger = false
    ): any => {
      if (logger) {
        Logger.info(
          typeof message_data === "string"
            ? message_data
            : JSON.stringify(message_data, null, 2)
        );
      }
      if (["string"].includes(typeof message_data)) {
        return {
          code,
          status,
          message: message_data,
        };
      } else if (["number", "boolean"].includes(typeof message_data)) {
        return {
          code,
          status,
          render: { value: message_data },
        };
      } else if (typeof message_data === "object") {
        if (Array.isArray(message_data)) {
          return {
            code,
            status,
            render: [...message_data],
          };
        }
        return {
          code,
          status,
          render: { ...message_data },
        };
      }
      return {
        code,
        status,
        render: message_data,
      };
    },
    SuccessHTML: (
      html: string,
      code: number = StatusCode.negative.client.BAD_REQUEST
    ) => {
      return {
        code,
        html,
      };
    },
    Error: {
      Client: (
        message: string | { [key: string]: any },
        status = "error",
        code: number = StatusCode.negative.client.BAD_REQUEST,
        logger = false
      ) => {
        if (logger) {
          Logger.error(
            typeof message === "string"
              ? message
              : JSON.stringify(message, null, 2)
          );
        }
        if (typeof message === "string") {
          return {
            code,
            status,
            message,
          };
        }
        if (typeof message === "object" && !Array.isArray(message)) {
          return {
            code,
            status,
            render: { ...message },
          };
        }
        return {
          code,
          status,
          render: message,
        };
      },
      ClientHTML: (
        html: string,
        code: number = StatusCode.negative.client.BAD_REQUEST,
        logger = false
      ) => {
        if (logger) {
          Logger.error(html);
        }
        return {
          code,
          html,
        };
      },
      Server: (error: ErrorMessage | any, logger = false) => {
        if (logger) {
          Logger.error(error);
        }
        return {
          code: StatusCode.negative.server.INTERNAL_SERVER_ERROR,
          status: "error",
          message: {
            text: error.message,
            stack: String(error.stack).split("\n"),
          },
        };
      },
    },
  },
};
