#!/usr/bin/env ts-node

// ================================================================ //
// ========================== 1st Module ========================== //

import * as path from "path";
import * as fs from "fs";

// ================================================================ //
// ========================== 3th Module ========================== //

import chalk from "chalk";
import * as inquirer from "inquirer";
import * as crypto from "crypto";

// ================================================================ //
// ========================= Main Module ========================== //

import {
  delay,
  Create,
  Generate,
  Convert,
  Information,
  System,
  Fetcher,
  Folder,
} from "./core";

import { my_website, jumpboot_website } from "./core/config";

// ================================================================ //
// ========================== Banner App ========================== //

import banner from "./core/banner";
banner();
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
  path.join(__dirname, "assets", "examples", file_name);

const license_dir = (file_name: string) =>
  path.join(__dirname, "assets", "examples", "licenses", file_name);

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
        path.join(__dirname, "root"),
        Information.project_root
      );

      // Copy Select Template
      await Folder.copy.to(
        path.join(__dirname, "template", select_template),
        Information.project_root
      );
      // Rename : template > src
      await Folder.rename(
        path.join(Information.project_root, select_template),
        path.join(Information.project_root, "src")
      );

      // Copy Core (default)
      await Folder.copy.to(
        path.join(__dirname, "core"),
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
      //
      const core_app = [];
      // Copy Core App Default
      await fs.copyFileSync(
        path.join(__dirname, "app", "Server.ts"),
        target_path.core_app("Server.ts")
      );
      core_app.push("Server");
      if (AnswerTemplate.rest_api_with_database === select_template_default) {
        await fs.copyFileSync(
          path.join(__dirname, "app", "Database.ts"),
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
            path.join(__dirname, "assets", "examples", "licenses")
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
