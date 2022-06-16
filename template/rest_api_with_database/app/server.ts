import { Server } from "../core";

// -------------------------------------------------------------- //
// ------------------ Import Manual Controller ------------------ //

Server.start([
  // for example controller
  require("../controllers/ExampleController").default,
]);
