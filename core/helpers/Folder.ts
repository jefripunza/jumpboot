import * as path from "path";
import * as fs from "fs";

async function copyFileSync(source: string, target: string) {
  let targetFile = target;
  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

export const Folder = {
  copy: {
    to: async (source: string, target: string) => {
      let files = [];
      // Check if folder needs to be created or integrated
      const targetFolder = path.join(target, path.basename(source));
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }
      // Copy
      if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(async (file) => {
          const curSource = path.join(source, file);
          if (fs.lstatSync(curSource).isDirectory()) {
            await Folder.copy.to(curSource, targetFolder);
          } else {
            await copyFileSync(curSource, targetFolder);
          }
        });
      }
    },
    AllFiles: {
      to: async (sourceFolder: string, targetFolder: string) => {
        const files = fs.readdirSync(sourceFolder);
        files.forEach(async (file) => {
          const curSource = path.join(sourceFolder, file);
          await copyFileSync(curSource, targetFolder);
        });
      },
    },
  },
  rename: async (oldPath: string, newPath: string) => {
    fs.renameSync(oldPath, newPath);
  },
};
