#!/usr/bin/env ts-node

// ================================================================ //
// ========================== 1st Module ========================== //

import * as path from "path";
import * as fs from "fs";
import * as child_process from "child_process";

// ================================================================ //
// ========================== 3th Module ========================== //

import axios, { AxiosResponse } from "axios";
import chalk from "chalk";
import * as inquirer from "inquirer";
import * as crypto from "crypto";

// ================================================================ //
// ========================= Main Module ========================== //

const isCompiled = String(__filename).endsWith(".js");

const delay = async (timeout = 500) => {
  return await new Promise((resolve) => setTimeout(resolve, timeout));
};

const Create = {
  Directory: {
    isNotExist: (dir: fs.PathLike) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        // promises.mkdir(dir, { recursive: true });
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

const full_characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const otp_characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const Generate = {
  random: {
    integer: (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    string: (length = 20) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += full_characters.charAt(
          Math.floor(Math.random() * full_characters.length)
        );
      }
      return result;
    },
    OTP: (length = 4) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += otp_characters.charAt(
          Math.floor(Math.random() * otp_characters.length)
        );
      }
      return result;
    },
    HEX: (length = 20) => {
      return crypto.randomBytes(length).toString("hex");
    },
  },
  multiple: {
    digits: (num: number) => {
      let text = "";
      for (let i = 0; i < num; i++) {
        if (i > 0) {
          text = `${text},`;
        }
        text = text + String(i + 1);
      }
      return text.split(",");
    },
    fill: (num: number) => {
      let angka = "";
      let a = 0;
      for (let i = 0; i < num; i++) {
        a++;
        if (a === 10) {
          a = 0;
        }
        angka += a;
      }
      return angka;
    },
  },
};

const Convert = {
  Text: {
    Original: {
      to: {
        CapitalizeFirstLetter: (str: string) => {
          return str
            .split(" ")
            .map((a: string | any[]) => {
              return a[0].toUpperCase() + a.slice(1);
            })
            .join(" ");
        },
      },
    },
    // ---------------------------------------------------------------------
    Space: {
      to: {
        CamelCase: (str: any) =>
          String(str)
            .split("_")
            .join(" ")
            .split("-")
            .join(" ")
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/\s+/g, ""),
      },
    },
    // ---------------------------------------------------------------------
    CamelCase: {
      to: {
        Title: (str: any) =>
          String(str)
            .replace(/([A-Z])/g, (match) => " " + match)
            .split(" ")
            .map((text) =>
              String(text).replace(/^./, (match) => match.toUpperCase())
            )
            .join(" ")
            .replace(/  /gi, " ")
            .trim(),
        SnakeCase: (str: any) =>
          String(str)
            .replace(/[A-Z]/g, (letter) => `_${String(letter).toLowerCase()}`)
            .split("")
            .filter((_, i) => i > 0)
            .join(""),
      },
    },
    // ---------------------------------------------------------------------
    All: {
      to: {
        AllFormat: (name: any) => {
          // init
          let new_name = name;

          // remove extension (js, ts)
          if (String(new_name).includes(".")) {
            new_name = String(new_name).split(".")[0];
          }

          // remove topic of first input
          new_name = String(new_name)
            .replace(/Controller/g, "")
            .replace(/controller/g, "")
            .replace(/Service/g, "")
            .replace(/service/g, "")
            .replace(/Entities/g, "")
            .replace(/entities/g, "")
            .replace(/Entity/g, "")
            .replace(/entity/g, "")
            .replace(/Repository/g, "")
            .replace(/repository/g, "");

          // to camel case
          const camelcase = Convert.Text.Space.to.CamelCase(new_name);

          const title = Convert.Text.CamelCase.to.Title(new_name);

          // save camel case
          const snakecase = Convert.Text.CamelCase.to.SnakeCase(camelcase);

          // for path rest controller
          const url_path = String(snakecase).toLowerCase().split("_").join("-");

          // render
          const render = {
            title,
            camelcase,
            snakecase,
            url_path,
          };
          // console.log({ render }); // debug
          return render;
        },
      },
    },
  },
  // ---------------------------------------------------------------------
  String: {
    only: {
      number: (text: string): number => {
        return parseInt(String(text).replace(/\D/g, ""));
      },
    },
  },
  Number: {
    only: {
      alphabet: (text: string) => {
        return String(text).replace(/[^a-zA-Z]+/g, "");
      },
    },
  },
};

const Information = {
  jumpboot_path: isCompiled ? path.join(__dirname, "..") : __dirname,
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

const Fix = {
  FirstZeros: (value: number) => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return (value < 10 ? "0" : "") + value;
  },
  UrlSlash: (url: string): any => {
    const text = String(String(url).startsWith("/") ? url : `/${url}`).replace(
      /\/\//gi,
      "/"
    );
    return String(text).includes("//") ? Fix.UrlSlash(text) : text;
  },
};

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

const System = {
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

interface DynamicString {
  [key: string]: string;
}

interface GetAndDelete {
  url: string;
  token?: string | boolean;
  headers?: DynamicString;
}
interface PostAndPut {
  url: string;
  token?: string | boolean;
  body?: object;
  headers?: DynamicString;
}
export const Fetcher = {
  get: async ({ url, token = false, headers = {} }: GetAndDelete) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.get(url, { headers }));
  },
  post: async ({ url, token = false, body = {}, headers = {} }: PostAndPut) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.post(url, body, { headers }));
  },
  put: async ({ url, token = false, body = {}, headers = {} }: PostAndPut) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.put(url, body, { headers }));
  },
  patch: async ({
    url,
    token = false,
    body = {},
    headers = {},
  }: PostAndPut) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.patch(url, body, { headers }));
  },
  delete: async ({ url, token = false, headers = {} }: GetAndDelete) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.delete(url, { headers }));
  },
};

async function handler(response: any) {
  return new Promise(async (resolve, reject) => {
    response
      .catch(function (error: {
        response: {
          status: any;
          data: { message: any };
          headers: any;
        };
        code?: string;
      }) {
        if (error?.response?.status) {
          reject({
            status: error.response.status,
            message: error.response.data.message,
            headers: error.response.headers,
          });
        } else {
          reject({ message: error.code });
        }
      })
      .then((result: AxiosResponse) => {
        try {
          return result.data;
        } catch (error) {
          reject(error);
        }
      })
      .then((result: unknown) => resolve(result));
  });
}

async function copyFileSync(source: string, target: string) {
  let targetFile = target;
  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  await fs.writeFileSync(targetFile, await fs.readFileSync(source));
}

const Folder = {
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

const my_website = "https://portofolio.jefripunza.repl.co";
const jumpboot_website = "https://github.com/jefripunza/jumpboot";

// ================================================================ //
// ========================== Banner App ========================== //

const jumpboot_figlet = `
     ██╗██╗   ██╗███╗   ███╗██████╗ ██████╗  ██████╗  ██████╗ ████████╗
     ██║██║   ██║████╗ ████║██╔══██╗██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝
     ██║██║   ██║██╔████╔██║██████╔╝██████╔╝██║   ██║██║   ██║   ██║   
██   ██║██║   ██║██║╚██╔╝██║██╔═══╝ ██╔══██╗██║   ██║██║   ██║   ██║   
╚█████╔╝╚██████╔╝██║ ╚═╝ ██║██║     ██████╔╝╚██████╔╝╚██████╔╝   ██║   
 ╚════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═════╝  ╚═════╝  ╚═════╝    ╚═╝  
`;
console.log(
  "\x1Bc", // color reset and clear
  chalk.bold.green(jumpboot_figlet),
  `
▸ Project Name : ${Information.project_name}
▸ Root Path    : ${Information.project_root}
▸ Home Path    : ${Information.path.home}
▸ PC Name      : ${Information.computer.name}
`
);

const line =
  "----------------------------------------------------------------------";
const batas = {
  atas: () => {
    console.log(`\n${line}`);
  },
  bawah: () => {
    console.log(`${line}\n`);
  },
};

// ================================================================ //
// =========================== Function =========================== //

const ask = {
  input: async (ask_now: string, require = false, default_value = "") => {
    const result = await inquirer.prompt([
      {
        type: "input",
        name: "main",
        message: ask_now,
        default: default_value,
        validate: (value: string | any[]) => {
          if (require) {
            if (value.length) {
              return true;
            }
            return `Please enter value...`;
          }
          return true;
        },
      },
    ]);
    return result.main;
  },
  list: async (ask_now: string, choices: string[]) => {
    const result = await inquirer.prompt([
      {
        type: "list",
        name: "main",
        message: ask_now,
        choices,
        default: choices[0],
      },
    ]);
    return result.main;
  },
  checkbox: async (ask_now: string, choices: string[]) => {
    const result = await inquirer.prompt([
      {
        type: "checkbox",
        name: "main",
        message: ask_now,
        choices,
      },
    ]);
    return result.main;
  },
};

const example_dir = (file_name: string) =>
  path.join(Information.jumpboot_path, "examples", file_name);

const license_dir = (file_name: string) =>
  path.join(Information.jumpboot_path, "examples", "licenses", file_name);

const prepare = async (message: string) => {
  console.log("");
  console.log(`▸ ${message}`);
  await delay();
};

const printStatus = (success: boolean, message: string) => {
  if (success) {
    console.log(`▸ Status : ${chalk.bold.greenBright(message)}`);
  } else {
    console.log(`▸ Status : ${chalk.bold.redBright(message)}`);
  }
  console.log("");
};

// ================================================================ //
// ======================= Example: Target ======================== //

enum FolderNameDefault {
  controllers = "controllers",
  services = "services",
  models = "models",
  repository = "repository",
  entities = "entities",
  middlewares = "middlewares",
  fetch = "fetch",
  tests = "tests",
  build = "dist",
}
interface TargetPath {
  controllers: (name: string) => string;
  services: (name: string) => string;
  repository: (name: string) => string;
  entities: (name: string) => string;
  middleware: (name: string) => string;
  fetch: (name: string) => string;
  src: (filename: string) => string;
  app: (filename: string) => string;
  test: (name: string) => string;
  build: (name: string) => string;
  root: (name: string) => string;
  // ----------------------------
  core_app: (filename: string) => string;
  [ket: string]: (name: string) => string;
}
const target_path: TargetPath = {
  controllers: (name: string): string =>
    path.join(
      String(Information.project_root),
      "src",
      FolderNameDefault.controllers,
      `${Convert.Text.All.to.AllFormat(name).camelcase}Controller.ts`
    ),
  services: (name: string): string =>
    path.join(
      String(Information.project_root),
      "src",
      FolderNameDefault.services,
      `${Convert.Text.All.to.AllFormat(name).camelcase}Service.ts`
    ),
  repository: (name: string) =>
    path.join(
      String(Information.project_root),
      "src",
      FolderNameDefault.models,
      FolderNameDefault.repository,
      `${Convert.Text.All.to.AllFormat(name).camelcase}Repository.ts`
    ),
  entities: (name: string) =>
    path.join(
      String(Information.project_root),
      "src",
      FolderNameDefault.models,
      FolderNameDefault.entities,
      `${Convert.Text.All.to.AllFormat(name).camelcase}Entity.ts`
    ),
  // -------------------------------------------------------------------- //
  middleware: (name: string): string =>
    path.join(
      String(Information.project_root),
      "src",
      FolderNameDefault.middlewares,
      `${name}.ts`
    ),
  fetch: (name: string): string =>
    path.join(
      String(Information.project_root),
      "src",
      FolderNameDefault.fetch,
      `${name}.ts`
    ),
  // -------------------------------------------------------------------- //
  test: (name: string): string =>
    path.join(
      String(Information.project_root),
      "src",
      FolderNameDefault.tests,
      `${name}.test.js`
    ),
  build: (name: string): string =>
    path.join(String(Information.project_root), FolderNameDefault.build, name),
  // -------------------------------------------------------------------- //
  src: (filename: string): string =>
    path.join(String(Information.project_root), "src", filename),
  app: (filename: string): string =>
    path.join(String(Information.project_root), "src", "app", filename),
  root: (name: string): string =>
    path.join(String(Information.project_root), name),
  // -------------------------------------------------------------------- //
  core_app: (filename: string): string =>
    path.join(String(Information.project_root), "src", "core", "app", filename),
};

// ================================================================ //
// ==================== Function: File Manager ==================== //

const sendFile = async (
  example: string, // switch method
  target: string, // to project directory
  replace_value: (src: string) => string,
  log = true
) => {
  Create.Directory.isNotExist(
    String(target).replace(path.basename(target), "")
  );
  //
  if (log) {
    await prepare(`Target : ${target} ...`);
  }
  // now !!!
  if (!fs.existsSync(target)) {
    // read file example & update sources & send to target
    fs.writeFileSync(
      target,
      replace_value(String(fs.readFileSync(example, { encoding: "utf-8" }))),
      { encoding: "utf-8" }
    );
    if (log) {
      printStatus(true, "success");
    }
  } else {
    if (log) {
      printStatus(false, "file exist");
    }
  }
};

const basicFile = async (
  file_name: string,
  file_target: any = false,
  source: any = false
) => {
  await sendFile(
    example_dir(file_name),
    file_target ? String(file_target) : target_path.root(file_name),
    (src) => {
      if (source) {
        return source(src);
      }
      return src;
    },
    false
  );
};

const removeGitInitDirectory = () => {
  const git_init_dir = path.join(Information.project_root, ".git");
  if (fs.existsSync(git_init_dir)) {
    fs.rmSync(git_init_dir, { recursive: true, force: true });
  }
};

// ================================================================ //
// =========================== Main App =========================== //
setTimeout(() => {
  (async () => {
    enum AnswerMain {
      init = "init",
      create = "create",
      git = "git",
    }
    const answer = await ask.list("Select Menu:", [
      // "test", // debug
      AnswerMain.init,
      AnswerMain.create,
      AnswerMain.git,
    ]);
    if (answer === "test") {
      console.log("TEST.....\n");
      // ------------------------------------------------------- //
    } else if (answer === AnswerMain.init) {
      // ------------------------------------------------------- //

      // Select Template
      enum AnswerTemplate {
        rest_api_only = "Rest API Only",
        rest_api_with_database = "Rest API with Database",
      }
      let select_template = await ask.list("Select Template:", [
        AnswerTemplate.rest_api_only,
        AnswerTemplate.rest_api_with_database,
      ]);
      const select_template_default = select_template;
      select_template = String(select_template)
        .toLocaleLowerCase()
        .replace(/ /g, "_");

      // ------------------------------------------------------- //

      // Add Secondary App
      // const secondary_app = await ask.checkbox("pilih:", ["aaa", "bbb", "ccc"]);
      // console.log({ secondary_app });

      // ------------------------------------------------------- //

      const project_name = await ask.input(
        "Project Name:",
        true,
        Information.project_name
      );
      const description = await ask.input("Description:");
      const convert = Convert.Text.All.to.AllFormat(project_name);

      // ------------------------------------------------------- //

      const author_name = await ask.input("Author Name:");
      const author_email = await ask.input("Author Email:");
      const author_url = await ask.input("Author Website:");
      const isAuthorAvailable = author_name || author_email || author_url;
      let author: any;
      if (isAuthorAvailable) {
        author = {
          name: author_name || undefined,
          email: author_email || undefined,
          url: author_url || undefined,
        };
        author = Object.keys(author).reduce((simpan: any, key: string) => {
          if (author[key]) {
            return {
              ...simpan,
              [key]: author[key],
            };
          }
          return {
            ...simpan,
          };
        }, {});
      }

      // ------------------------------------------------------- //

      let git_remote: any = await ask.input("Git Remote:");
      let git_branch;
      if (git_remote === "") {
        git_remote = false;
      } else {
        // check if remote available
        try {
          // testing : https://github.com/jefripunza/testing
          await Fetcher.get({ url: git_remote });
          // console.log("GO...");
          git_branch = String(git_remote).includes("github.com")
            ? "main"
            : "master";
        } catch (error) {
          git_remote = false;
          console.error("Repository Not Found!!!, SKIP...");
        }
      }

      // ------------------------------------------------------- //
      await prepare("Ready create init project ...");
      // ------------------------------------------------------- //

      // Copy Root (default)
      await Folder.copy.AllFiles.to(
        path.join(Information.jumpboot_path, "root"),
        Information.project_root
      );

      // Copy Select Template
      await Folder.copy.to(
        path.join(Information.jumpboot_path, "template", select_template),
        Information.project_root
      );
      // Rename : template > src
      await Folder.rename(
        path.join(Information.project_root, select_template),
        path.join(Information.project_root, "src")
      );

      // Copy Core (default)
      await Folder.copy.to(
        path.join(Information.jumpboot_path, "core"),
        path.join(Information.project_root, "src")
      );

      // make folder core app
      await fs.mkdirSync(target_path.core_app(""), { recursive: true });
      const path_core_index = path.join(
        Information.project_root,
        "src",
        "core",
        "index.ts"
      );
      // re-write core index.ts > export app
      const core_index = await fs.readFileSync(path_core_index, {
        encoding: "utf-8",
      });
      await fs.writeFileSync(
        path_core_index,
        core_index + `\nexport * from "./app";\n`,
        { encoding: "utf-8" }
      );

      const core_app = [];
      // Copy Core App Default
      await fs.copyFileSync(
        path.join(Information.jumpboot_path, "app", "Server.ts"),
        target_path.core_app("Server.ts")
      );
      core_app.push("Server");
      if (AnswerTemplate.rest_api_with_database === select_template_default) {
        await fs.copyFileSync(
          path.join(Information.jumpboot_path, "app", "Database.ts"),
          target_path.core_app("Database.ts")
        );
        core_app.push("Database");
      }

      // Copy from Checkbox Select Core App

      // Write index.ts on Core App
      await fs.writeFileSync(
        target_path.core_app("index.ts"),
        core_app
          .map((v) => {
            return `export * from "./${v}";`;
          })
          .join("\n"),
        { encoding: "utf-8" }
      );

      // .env (modify)
      basicFile(
        ".env." + select_template,
        target_path.root(".env"),
        (src: any) =>
          String(src)
            .replace(/example_url_path/g, convert.url_path)
            .replace(
              /example_password_iv/g,
              crypto.randomBytes(16).toString("hex").slice(0, 16)
            )
            .replace(/example_password_encryption/g, Generate.random.HEX())
            .replace(/example_secret_token/g, Generate.random.HEX())
      );

      // .gitignore
      basicFile("gitignore", target_path.root(".gitignore"));

      // package.json (modify)
      basicFile(
        "package.json." + select_template,
        target_path.root("package.json"),
        (src: any) => {
          let render = String(src)
            .replace(/package-project-name/g, convert.url_path)
            .replace(/package-description/g, description);
          if (author?.name) {
            render = render.replace(/your full name/g, author.name);
          }
          if (author?.email) {
            render = render.replace(/your@email.com/g, author.email);
          }
          if (author?.url) {
            render = render.replace(
              /https:\/\/your-portofolio-website.com/g,
              author.url
            );
          }
          return render;
        }
      );

      // README.md (modify)
      basicFile("README.md", false, (src: any) =>
        String(src)
          .replace(
            /project title/g,
            Convert.Text.Original.to.CapitalizeFirstLetter(project_name)
          )
          .replace(/my-site.com/g, my_website)
          .replace(/jumpboot-site.com/g, jumpboot_website)
      );

      // ----------------------------------------------------------------------
      // ----------------------------------------------------------------------

      // package install
      await System.execute(["yarn"]);

      // check if input git remote
      if (git_remote) {
        removeGitInitDirectory();
        // auto push to remote
        await System.execute([
          "git init",
          `git remote add origin ${git_remote}`,
          "git add .",
          `git commit -m "first commit (jumpboot)"`,
          `git branch -M ${git_branch}`,
          `git push -u origin ${git_branch}`,
        ]);
      }
    } else if (answer === AnswerMain.create) {
      enum AnswerCreate {
        controllers = "controllers (core)",
        services = "services (core)",
        repository = "repository (core)",
        entities = "entities (core)",
        all = "all (core)",
        middleware = "middleware",
        fetcher = "fetcher",
        license = "LICENSE",
      }
      const topic = await ask.list("What's Create:", [
        // ----------------------------------
        // Core
        AnswerCreate.controllers,
        AnswerCreate.services,
        AnswerCreate.repository,
        AnswerCreate.entities,
        AnswerCreate.all,
        // ----------------------------------
        // Others Item
        AnswerCreate.middleware,
        AnswerCreate.fetcher,
        AnswerCreate.license,
      ]);
      if (
        [
          AnswerCreate.controllers,
          AnswerCreate.services,
          AnswerCreate.repository,
          AnswerCreate.entities,
          AnswerCreate.all,
        ].includes(topic) // is core
      ) {
        const topic_name = await ask.input("Topic Name:", true);
        const { camelcase, snakecase, url_path } =
          Convert.Text.All.to.AllFormat(topic_name);
        if (topic === AnswerCreate.all) {
          // all core
          await prepare("Ready create all core...");
          //
          await sendFile(
            example_dir("Controller.ts"),
            target_path.controllers(topic_name),
            (src) =>
              String(src)
                .replace("// import *", "import *")
                .replace(/target-url-endpoint/g, url_path)
                .replace(/TargetCamelCase/g, camelcase)
          );
          //
          await sendFile(
            example_dir("Service.ts"),
            target_path.services(topic_name),
            (src) =>
              String(src)
                .replace("// import *", "import *")
                .replace(/TargetCamelCase/g, camelcase)
          );
          //
          await sendFile(
            example_dir("Repository.ts"),
            target_path.repository(topic_name),
            (src) =>
              String(src)
                .replace("// import ", "import ")
                .replace(/TargetCamelCase/g, camelcase)
          );
          //
          await sendFile(
            example_dir("Entity.ts"),
            target_path.entities(topic_name),
            (src) =>
              String(src)
                .replace(/target_snake_case/g, snakecase)
                .replace(/TargetCamelCase/g, camelcase)
          );
        } else {
          // spesifik
          if (topic === AnswerCreate.controllers) {
            await prepare("Ready create controller...");
            await sendFile(
              example_dir("Controller.ts"),
              target_path.controllers(topic_name),
              (src) =>
                String(src)
                  .replace(/target-url-endpoint/g, url_path)
                  .replace(/TargetCamelCase/g, camelcase)
            );
          } else if (topic === AnswerCreate.services) {
            await prepare("Ready create service...");
            await sendFile(
              example_dir("Service.ts"),
              target_path.services(topic_name),
              (src) => String(src).replace(/TargetCamelCase/g, camelcase)
            );
          } else if (topic === AnswerCreate.repository) {
            await prepare("Ready create repository...");
            await sendFile(
              example_dir("Repository.ts"),
              target_path.repository(topic_name),
              (src) => String(src).replace(/TargetCamelCase/g, camelcase)
            );
          } else if (topic === AnswerCreate.entities) {
            await prepare("Ready create entity...");
            await sendFile(
              example_dir("Entity.ts"),
              target_path.entities(topic_name),
              (src) =>
                String(src)
                  .replace(/target_snake_case/g, snakecase)
                  .replace(/TargetCamelCase/g, camelcase)
            );
          }
        }
      } else {
        if (topic === AnswerCreate.middleware) {
          const file_name = await ask.input("Middleware Name:", true);
          const { camelcase } = Convert.Text.All.to.AllFormat(file_name);
          await prepare("Ready create middleware...");
          await sendFile(
            example_dir("Middleware.ts"),
            target_path.middleware(camelcase),
            (src) => String(src).replace(/TargetCamelCase/g, camelcase)
          );
        } else if (topic === AnswerCreate.fetcher) {
          const file_name = await ask.input("Fetcher Name:", true);
          const method_select = await ask.list("Select Method:", [
            "Get",
            "Post",
            "Put",
            "Patch",
            "Delete",
          ]);
          // ------------
          const { camelcase } = Convert.Text.All.to.AllFormat(file_name);
          await prepare("Ready create fetcher...");
          basicFile(`Fetcher${method_select}.ts`, target_path.fetch(camelcase));
        } else if (topic === AnswerCreate.license) {
          const list_license = fs.readdirSync(
            path.join(Information.jumpboot_path, "examples", "licenses")
          );
          const license_select = await ask.list("License Type:", list_license);
          //
          await prepare("Ready create LICENSE...");
          await sendFile(
            license_dir(license_select),
            target_path.root("LICENSE"),
            (src) =>
              String(src).replace(/license_year/, `${new Date().getFullYear()}`)
            // .replace(/license_author/, package_json.author.name)
            // .replace(/license_author_url/, package_json.author.url)
          );
        }
      }
    } else if (answer === AnswerMain.git) {
      enum AnswerGit {
        init = "init",
        push = "push",
        list_branch = "list branch",
        create_branch = "create branch",
        change_branch = "change branch",
        merge = "merge",
        graph = "graph", // git log --all --decorate --oneline --graph
      }
      const command = await ask.list("What's Git Command:", [
        AnswerGit.init,
        AnswerGit.push,
        AnswerGit.list_branch,
        AnswerGit.create_branch,
        AnswerGit.change_branch,
        AnswerGit.merge,
        AnswerGit.graph,
      ]);

      // selalu check branch
      let result_branch: any = [];
      try {
        result_branch = await new Promise((resolve, reject) => {
          require("child_process").exec(
            "git branch",
            {
              cwd: Information.project_root,
            },
            (error: { message: string | undefined }, stdout: string) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                resolve(stdout);
              }
            }
          );
        });
      } catch (error) {
        // skip...
      }
      interface ListBranch {
        default: boolean;
        branch: string;
      }
      const list_branch: ListBranch[] = String(result_branch)
        .split("\n") // split per enter
        .filter((v) => v.length > 0) // seng kosong, skip
        .map((v) => v.trim()) // remove whitelist
        .map((v) =>
          v.startsWith("*")
            ? { default: true, branch: v.replace("* ", "") }
            : { default: false, branch: v }
        )
        .sort((x, y) => (x.default === y.default ? 0 : x.default ? -1 : 1));
      if (command === AnswerGit.init) {
        let next = false;
        if (!fs.existsSync(path.join(Information.project_root, ".git"))) {
          next = true;
        } else {
          printStatus(false, ".git is exist !!!");
        }
        let yes_next = "n";
        if (!next) {
          yes_next = await ask.input("Force Next: (y/n)", true);
        }
        if (next || yes_next === "y") {
          removeGitInitDirectory();
          try {
            // ask : remote
            const remote: string = await ask.input("Remote URL:", true);
            await Fetcher.get({ url: remote });
            const default_branch: string = await ask.list("Default Branch:", [
              "main", // github
              "master", // gitlab
            ]);
            if (
              !fs.existsSync(path.join(Information.project_root, "README.md"))
            ) {
              basicFile("README.md", false, (src: any) =>
                String(src)
                  .replace(
                    /project title/g,
                    Convert.Text.Original.to.CapitalizeFirstLetter(
                      Information.project_name
                    )
                  )
                  .replace(/my-site.com/g, my_website)
                  .replace(/jumpboot-site.com/g, jumpboot_website)
              );
            }
            // auto push to remote
            await System.execute([
              "git init",
              `git remote add origin ${remote}`,
              "git add .",
              `git commit -m "first commit (jumpboot)"`,
              `git branch -M ${default_branch}`,
              `git push -u origin ${default_branch}`,
            ]);
          } catch (error) {
            console.error("Repository Not Found!!!, SKIP...");
          }
        } else {
          console.error("skip initialize git...");
        }
      } else if (command === AnswerGit.push) {
        const default_branch: string = list_branch.filter((v) => v.default)[0]
          .branch;
        const commit: string = await ask.input("Commit:", true);
        await System.execute([
          `git pull`,
          `git add .`,
          `git commit -m "${commit.replace(/"/g, '\\"').replace(/&/g, "and")}"`,
          `git push -u origin ${default_branch}`,
        ]);
      } else if (command === AnswerGit.list_branch) {
        const show_all_branch = list_branch
          .map((v) =>
            v.default
              ? `${v.branch} ${chalk.bold.greenBright("(now)")}`
              : v.branch
          )
          .join("\n");
        console.log(show_all_branch);
      } else if (command === AnswerGit.create_branch) {
        const branch = await ask.input("Branch Name:", true);
        await System.execute([`git checkout -b ${branch}`]);
      } else if (command === AnswerGit.change_branch) {
        const branch_target = await ask.list(
          "Branch target:",
          list_branch.map((v) => v.branch)
        );
        await System.execute([`git checkout ${branch_target}`]);
      } else if (command === AnswerGit.merge) {
        const show_others_branch = list_branch
          .filter((v) => !v.default)
          .map((v) => v.branch);
        const branch_target = await ask.list(
          "Branch target:",
          show_others_branch
        );
        await System.execute([`git merge ${branch_target}`]);
      } else if (command === AnswerGit.graph) {
        batas.atas();
        await require("child_process")
          .spawn(
            "git",
            ["log", "--all", "--decorate", "--oneline", "--graph"],
            {
              stdio: "inherit",
            }
          )
          .on("exit", function (error: any) {
            if (!error) {
              batas.bawah();
              console.log("End!");
            }
          });
      }
    }

    // ------------------------------------------------------------------------------- //
    // ------------------------------------------------------------------------------- //
    await delay(); // end
  })();
}, 100);
