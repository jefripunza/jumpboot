import { Request, Response, Fetcher, StatusCode, requireEnv } from "../core";

// requireEnv("ENV_VALUE");

const TargetCamelCase = (): MethodDecorator => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;
    descriptor.value = async (...args: any[]) => {
      const req = args[0] as Request;
      const res = args[1] as Response;
      function next(this: any) {
        return original.apply(this, args);
      }
      function negativeResponse(code: number, message: string | object) {
        return res.status(code).json({ message });
      }
      // -------------------------------------------------------- //
      // args[0].add_meta_to_req = "value"

      // code here ...

      // -------------------------------------------------------- //
      return next();
    };
  };
};

export default TargetCamelCase;
