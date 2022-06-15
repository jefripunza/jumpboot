import { DocumentationDefinition } from "../../";

// Routes
export const Documentation = ({
  description,
  request,
  response,
}: any): MethodDecorator | any => {
  return (target: { constructor: Object }, propertyKey: string): void => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("documentation", target.constructor)) {
      Reflect.defineMetadata("documentation", [], target.constructor);
    }

    // Get the documentation stored so far, extend it by the new route and re-set the metadata.
    const documentation = Reflect.getMetadata(
      "documentation",
      target.constructor
    ) as DocumentationDefinition[];

    documentation.push({
      methodName: propertyKey,
      description,
      request,
      response,
    });

    Reflect.defineMetadata("documentation", documentation, target.constructor);
  };
};
