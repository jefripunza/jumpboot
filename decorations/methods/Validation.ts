import * as path from "path";

import { Request, Response } from "express";

import { StatusCode, Fix } from "../../";

export const ValidateQuery = (validate: string[]): MethodDecorator => {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const request = args[0] as Request;
      const response = args[1] as Response;
      const next = () => {
        return original.apply(this, args);
      };
      function negativeResponse(message: string) {
        return response
          .status(StatusCode.negative.client.BAD_REQUEST)
          .json({ message });
      }
      if (validate.length > 0) {
        if (
          !validate.some(
            (require) => !Object.keys(request.query).includes(require)
          )
        ) {
          return next(); // validate
        } else {
          return negativeResponse(
            `query (${validate.join(" & ")}) is required!`
          );
        }
      } else {
        return next(); // array 0
      }
    };
  };
};

interface BodyOptions {
  [key: string]: string;
}

/**
 * di sini ada judul
 * @param validate nilai2 yang akan di validasi
 * @returns string error atau apalah terserah kau bae
 */
export const ValidateBody = (
  validate: BodyOptions | string[]
): MethodDecorator => {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const request = args[0] as Request;
      const response = args[1] as Response;
      const next = () => {
        return original.apply(this, args);
      };
      function negativeResponse(message: string) {
        return response
          .status(StatusCode.negative.client.BAD_REQUEST)
          .json({ message });
      }
      if (typeof validate === "object" && Array.isArray(validate)) {
        //
        // is array (#) only key
        //
        if (validate.length > 0) {
          // valid here...
          if (
            !validate.some(
              (require) => !Object.keys(request.body).includes(require)
            )
          ) {
            return next(); // validate
          } else {
            return negativeResponse(
              `body (${validate.join(" & ")}) is required!`
            );
          }
        } else {
          return next(); // array 0
        }
      } else if (typeof validate === "object" && !Array.isArray(validate)) {
        //
        // is object (#) specific
        //
        const keys = Object.keys(validate);
        const values = Object.values(validate);
        const body = request.body;
        let notValid = "";
        let reference = "";
        keys.forEach((key, i) => {
          const valid: string | string[] = values[i];
          const value = body[key];
          // valid here...
          function validateValue(value_valid: string) {
            if (
              ["array", "object"].includes(String(value_valid).toLowerCase())
            ) {
              // specific validate
              if (
                String(value_valid).toLowerCase() === "array" &&
                typeof value === "object" &&
                Array.isArray(value)
              ) {
                // lolos
              } else if (
                String(value_valid).toLowerCase() === "object" &&
                typeof value === "object" &&
                !Array.isArray(value)
              ) {
                // lolos
              } else {
                notValid += `${key}:'${value_valid}'`;
              }
            } else {
              if (typeof value !== value_valid) {
                if (
                  notValid &&
                  typeof notValid === "string" &&
                  String(notValid).length > 0
                ) {
                  notValid += ", ";
                } else if (notValid === null) {
                  notValid = "";
                }
                notValid += `${key}:'${value_valid}'`;
              }
            }
          }
          if (typeof valid === "string") {
            if (!String(valid).includes("null")) {
              if (String(valid).includes("|")) {
                String(valid)
                  .split("|")
                  .forEach((v) => {
                    validateValue(v);
                  });
              } else {
                validateValue(valid);
              }
            } else {
              if (!reference) {
                reference = " and (";
              } else {
                reference += ", ";
              }
              reference += `${key}:'${String(valid)
                .split("|")
                .filter((v) => v !== "null")
                .join("|")}'`;
            }
          } else if (typeof valid === "object" && Array.isArray(valid)) {
            [...valid].forEach((v) => {
              validateValue(v);
            });
          }
        });
        if (notValid) {
          if (reference) {
            reference += ") is reference";
          }
          return negativeResponse(
            `body (${notValid}) is required${reference} !!`
          );
        } else {
          return next(); // validate
        }
      }
    };
  };
};

interface FilesOptions {
  [key: string]: {
    size?: number;
    extension?: string;
  };
}
interface FilesValues {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: object;
  size: number;
  name: string;
  type: string;
}
export const ValidateFiles = (validate: FilesOptions): MethodDecorator => {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const request: any = args[0] as Request;
      const response = args[1] as Response;
      const next = () => {
        return original.apply(this, args);
      };
      function negativeResponse(message: string) {
        return response
          .status(StatusCode.negative.client.BAD_REQUEST)
          .json({ message });
      }
      const keys = Object.keys(validate);
      const values = Object.values(validate);
      const files = request.files;

      if (Object.keys(files).length > 0) {
        if (
          !keys.some((require) => !Object.keys(request.files).includes(require))
        ) {
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const { extension, size } = values[i];
            const value: FilesValues = files[key];
            // validate: extension
            if (
              extension &&
              !String(extension)
                .toLowerCase()
                .split("|")
                .some((v) => String(value.type).toLowerCase().includes(v))
            ) {
              return negativeResponse(
                `[${key}](${value.originalFilename})(${value.type}) extension is not allowed! (${extension})`
              );
            }
            // validate: size
            if (size) {
              const value_size = parseFloat(
                (value.size / 1024 / 1024).toFixed(2)
              );
              if (value_size > size) {
                return negativeResponse(
                  `[${key}](${value.originalFilename})(${value_size}MB) file size is not allowed! (${size}MB)`
                );
              }
            }

            // add meta : mv
            interface MoveOption {
              fileName?: string;
              backDate?: boolean;
              convert?: number;
            }
            args[0].files[key].mv = async (
              to: string,
              option: MoveOption = {}
            ) => {
              const { name, ext } = path.parse(value.originalFilename);

              // change name
              let fileName = option.fileName ? option.fileName : name;

              // add date
              if (option.backDate) {
                const now = new Date();
                const new_date = `${Fix.FirstZeros(
                  now.getFullYear()
                )}-${Fix.FirstZeros(now.getMonth() + 1)}-${Fix.FirstZeros(
                  now.getDate()
                )}_${Fix.FirstZeros(now.getHours())}-${Fix.FirstZeros(
                  now.getMinutes()
                )}-${Fix.FirstZeros(now.getSeconds())}_${Fix.FirstZeros(
                  now.getMilliseconds()
                )}`;
                fileName = `${fileName}_${new_date}`;
              }

              // add extension
              fileName = fileName + ext;

              // saved!
              return path.join(to, fileName);
            };
          }
          return next(); // debug
        } else {
          return negativeResponse(
            `files (${Object.keys(validate).join(" & ")}) is required!`
          );
        }
      } else {
        return negativeResponse(
          `files (${Object.keys(validate).join(" & ")}) is required!`
        );
      }
    };
  };
};
