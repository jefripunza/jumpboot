import * as path from "path";
import * as fs from "fs";

import { isCompiled } from "./../";
import { jumpboot_website, email_author } from "../config";

const readAssets = (filename: string): string => {
  return fs.readFileSync(path.join(__dirname, "..", "assets", filename), {
    encoding: "utf-8",
  });
};

export const Page = {
  Welcome: () => {
    if (isCompiled) {
      return "welcome to jumpboot";
    }
    const html = readAssets("index.html");
    const { version } = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "package.json"), {
        encoding: "utf-8",
      })
    );
    return String(html)
      .replace(/value-version/g, version)
      .replace(/url-jumpboot-official/g, jumpboot_website)
      .replace(/email-author/g, email_author)
      .replace(
        /"array-contribution"/g,
        JSON.stringify([
          {
            name: "Jefri Herdi Triyanto",
            url: "jefripunza",
          },
          {
            name: "Achmad Rifa'i",
            url: "AchmadRifai",
          },
          {
            name: "Meiman Jaya Gea",
            url: "meimanjayagea",
          },
          {
            name: "Dicky Ardiar",
            url: "Dickyrdiar",
          },
        ])
      )
      .replace(
        /"array-detail-folder"/g,
        JSON.stringify([
          {
            title: "Controllers",
            content:
              "routing management and incoming data from client requests",
          },
          {
            title: "Services",
            content: "main logic in the project",
          },
          {
            title: "Models - Repository",
            content: "logic to organize data in database",
          },
          {
            title: "Models - Entities",
            content: "table schema in this project",
          },
          {
            title: "App",
            content: "list of applications to use",
          },
          {
            title: "Middlewares",
            content:
              "bridge validation or conversion from router to controller",
          },
          {
            title: "Fetch",
            content:
              "access outside the project, usually used for communication between microservices",
          },
          {
            title: "Static",
            content:
              "files that can be accessed such as assets for frontend needs",
          },
        ])
      );
  },
  Error404: (endpoint: string) => {
    if (isCompiled) {
      return "page not found";
    }
    const html = readAssets("404.html");
    return String(html).replace(/url-endpoint/g, endpoint);
  },
};
