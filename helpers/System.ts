import * as child_process from "child_process";

import { Fix, Information } from "../";

const formatUptime = (seconds: string | number) => {
  const fix_seconds =
    typeof seconds === "string" ? parseInt(seconds, 10) : seconds;
  const hours = Math.floor(fix_seconds / (60 * 60));
  const minutes = Math.floor((fix_seconds % (60 * 60)) / 60);
  const ok_seconds = Math.floor(fix_seconds % 60);
  return `${Fix.FirstZeros(hours)} Jam ${Fix.FirstZeros(
    minutes
  )} Menit ${Fix.FirstZeros(ok_seconds)} Detik`;
};

export const System = {
  uptime: () => {
    return formatUptime(process.uptime());
  },
  //
  execute: async (cmd: string[], dirname = Information.project_root) => {
    return await new Promise((resolve, reject) => {
      const exec: any = child_process.exec(
        cmd.join(" && "),
        {
          cwd: dirname,
        },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(error.message));
          } else {
            resolve(stdout);
          }
        }
      );
      exec.stdout.pipe(process.stdout);
    });
  },
};
