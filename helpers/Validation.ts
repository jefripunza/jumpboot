export const Validation = {
  isObject: (value: object) => {
    return typeof value === "object" && !Array.isArray(value);
  },
  isArray: (value: any[]) => {
    return typeof value === "object" && Array.isArray(value);
  },
};
