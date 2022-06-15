import * as fs from "fs";
import * as path from "path";

import { Fix } from "../";

// ------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------- //

const log_dir = path.join(__dirname, "..", "..", "log");

// ------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------- //

interface Dynamic {
  [key: string]: string;
}

interface ErrorMessage {
  message: string;
  stack: string;
}

// ------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------- //

const line_break = (now: Date) => {
  return `========================================================================
=============================== ${Fix.FirstZeros(
    now.getHours()
  )}:${Fix.FirstZeros(now.getMinutes())}:${Fix.FirstZeros(
    now.getSeconds()
  )} ===============================
`;
};

const writeLog = (target: string, save: string | NodeJS.ArrayBufferView) => {
  if (!fs.existsSync(log_dir)) {
    fs.mkdirSync(log_dir);
  }
  const target_folder = path.join(log_dir, target);
  if (!fs.existsSync(target_folder)) {
    fs.mkdirSync(target_folder);
  }
  //
  const now = new Date();
  const this_file = path.join(
    target_folder,
    `${now.getFullYear()}-${Fix.FirstZeros(
      now.getMonth() + 1
    )}-${Fix.FirstZeros(now.getDate())}.txt`
  );
  //
  if (fs.existsSync(this_file)) {
    save =
      fs.readFileSync(this_file, { encoding: "utf-8" }) +
      "\n\n\n" +
      line_break(now) +
      save;
  } else {
    save = line_break(now) + save;
  }
  //
  fs.writeFileSync(this_file, save, {
    encoding: "utf-8",
  });
};

// ------------------------------------------------------------------------------- //
// ------------------------------------------------------------------------------- //

export const Logger = {
  // --------------------------------------------------------------------- //
  error: (error: string | ErrorMessage) => {
    if (typeof error === "string") {
      writeLog("error", error);
    } else {
      writeLog("error", `Error: ${error.message}\nStack: ${error.stack}`);
    }
  },
  // --------------------------------------------------------------------- //
  info: (message: any) => {
    if (typeof message === "object") {
      writeLog("info", JSON.stringify(message, null, 4));
    } else {
      writeLog("info", message);
    }
  },
  // --------------------------------------------------------------------- //
};
