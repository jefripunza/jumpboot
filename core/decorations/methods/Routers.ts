import { Method } from "../..";
import { DocumentationDefinition } from "../../interface/Documentation";

type MethodType =
  | "all"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options";

interface RouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: MethodType;
  // Method name within our class responsible for this route
  methodName: string;
  // For Documentation (if use)
  documentation?: DocumentationDefinition;
}

const handler = (
  target: Object,
  propertyKey: string,
  path: string,
  requestMethod: MethodType
) => {
  // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
  // To prevent any further validation simply set it to an empty array here.
  if (!Reflect.hasMetadata("routes", target.constructor)) {
    Reflect.defineMetadata("routes", [], target.constructor);
  }

  // Get the routes stored so far, extend it by the new route and re-set the metadata.
  const routes = Reflect.getMetadata(
    "routes",
    target.constructor
  ) as RouteDefinition[];

  routes.push({
    requestMethod,
    path,
    methodName: propertyKey,
  });
  Reflect.defineMetadata("routes", routes, target.constructor);
};

// Routes
export const GetMapping = (path: string): MethodDecorator | any => {
  return (target: Object, propertyKey: string): void => {
    return handler(target, propertyKey, path, Method.GET);
  };
};
export const PostMapping = (path: string): MethodDecorator | any => {
  return (target: Object, propertyKey: string): void => {
    return handler(target, propertyKey, path, Method.POST);
  };
};
export const PutMapping = (path: string): MethodDecorator | any => {
  return (target: Object, propertyKey: string): void => {
    return handler(target, propertyKey, path, Method.PUT);
  };
};
export const PatchMapping = (path: string): MethodDecorator | any => {
  return (target: Object, propertyKey: string): void => {
    return handler(target, propertyKey, path, Method.PATCH);
  };
};
export const DeleteMapping = (path: string): MethodDecorator | any => {
  return (target: Object, propertyKey: string): void => {
    return handler(target, propertyKey, path, Method.DELETE);
  };
};
