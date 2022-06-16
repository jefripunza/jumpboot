import * as path from "path";
import * as fs from "fs";
import { Create } from "..";

const tempDir = path.join(__dirname, "..", "temp");

export const Files = {
  save: {
    to: {
      temp: (filename: string, sources: Buffer) => {
        Create.Directory.isNotExist(tempDir);
        const file_temp_target = path.join(tempDir, filename);
        fs.writeFileSync(file_temp_target, sources);
        return file_temp_target;
      },
    },
  },
};
