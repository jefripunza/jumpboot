import { existsSync, mkdirSync, PathLike } from "fs";

export const Create = {
  Directory: {
    isNotExist: (dir: PathLike) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    },
  },
  Date: {
    sum: {
      Minutes: (date: Date, minutes: number) => {
        return new Date(date.getTime() + minutes * 60000);
      },
    },
  },
};
