import * as dotenv from "dotenv";
import banner from "./banner";

export const isProduction = process.env.NODE_ENV === "production";
export const isCompiled = String(__filename).endsWith(".js");

dotenv.config();

setTimeout(() => {
  banner();
}, 50);
