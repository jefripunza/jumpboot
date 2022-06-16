import { Information, isCompiled } from ".";

import chalk from "chalk";

// -----------------------------------------------------

// import * as figlet from "figlet";

const jumpboot_figlet = `
     ██╗██╗   ██╗███╗   ███╗██████╗ ██████╗  ██████╗  ██████╗ ████████╗
     ██║██║   ██║████╗ ████║██╔══██╗██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝
     ██║██║   ██║██╔████╔██║██████╔╝██████╔╝██║   ██║██║   ██║   ██║   
██   ██║██║   ██║██║╚██╔╝██║██╔═══╝ ██╔══██╗██║   ██║██║   ██║   ██║   
╚█████╔╝╚██████╔╝██║ ╚═╝ ██║██║     ██████╔╝╚██████╔╝╚██████╔╝   ██║   
 ╚════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═════╝  ╚═════╝  ╚═════╝    ╚═╝  
`;

const banner = () => {
  if (!isCompiled) {
    console.log("\x1Bc"); // color reset and clear
  }

  // console.log(
  //   chalk.bold.green(
  //     figlet.textSync("JUMPBOOT", {
  //       whitespaceBreak: true,
  //       font: "ANSI Shadow",
  //       horizontalLayout: "default",
  //       verticalLayout: "default",
  //     })
  //   )
  // );

  console.log(chalk.bold.green(jumpboot_figlet));

  console.log(Information.project_root);
  console.log(`
  ▸ Project Name : ${Information.project_name}
  ▸ Home Path    : ${Information.path.home}
  ▸ PC Name      : ${Information.computer.name}
  `);
};

// banner(); // single test
export default banner;
