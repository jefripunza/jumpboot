export const requireEnv = (
  key: string,
  suggestion: boolean | string | number | void = false
): any => {
  if (!process.env[key]) {
    let message = `${key} not found in .env !!`;
    if (suggestion) {
      message += `\n\n#suggestion\n${key}=${suggestion}\n\n`;
    }
    throw new Error(message);
  } else {
    return process.env[key];
  }
};

export const addController = (file_name: string) => {
  console.log({ __dirname });
  return require("../../src/controllers/" + file_name).default;
};
