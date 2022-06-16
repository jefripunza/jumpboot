import * as path from "path";

export const Information = {
  project_root: process.env.PWD
    ? String(process.env.PWD)
    : String(process.env.CWD),
  project_name: path.basename(process.cwd()),
  computer: {
    name: process.env.HOSTNAME,
  },
  path: {
    home: process.env.HOME,
  },
  IP: {
    local: async () =>
      await new Promise((resolve) => {
        require("dns").lookup(
          require("os").hostname(),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          function (err: any, add: unknown, fam: any) {
            resolve(add);
          }
        );
      }),
  },
};
