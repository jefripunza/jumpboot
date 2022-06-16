import * as path from "path";
import * as fs from "fs";

import { isCompiled } from "..";
import {
  jumpboot_version,
  jumpboot_website,
  email_author,
  jumpboot_contribution,
  jumpboot_detail_folder,
} from "../config";

const readAssets = (filename: string): string => {
  return fs.readFileSync(path.join(__dirname, "..", "static", filename), {
    encoding: "utf-8",
  });
};

export const Page = {
  Welcome: () => {
    if (isCompiled) {
      return "welcome to jumpboot";
    }
    const html = readAssets("index.html");
    return String(html)
      .replace(/value-version/g, jumpboot_version)
      .replace(/url-jumpboot-official/g, jumpboot_website)
      .replace(/email-author/g, email_author)
      .replace(/"array-contribution"/g, JSON.stringify(jumpboot_contribution))
      .replace(
        /"array-detail-folder"/g,
        JSON.stringify(jumpboot_detail_folder)
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
