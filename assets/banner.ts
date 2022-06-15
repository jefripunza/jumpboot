import { Information } from "../";

import chalk from "chalk";
import * as figlet from "figlet";

const banner = () => {
  console.log("\x1Bc"); // color reset and clear
  console.log(
    chalk.bold.green(
      figlet.textSync("JUMPBOOT", {
        whitespaceBreak: true,
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  console.log(Information.project_root);
  console.log(`
  ▸ Project Name : ${Information.project_name}
  ▸ Home Path    : ${Information.path.home}
  ▸ PC Name      : ${Information.computer.name}
  `);
};

// banner(); // single test
export default banner;
