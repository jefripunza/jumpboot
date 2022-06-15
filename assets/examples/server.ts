import { Server } from "jumpboot";

// -------------------------------------------------------------- //
// ------------------ Import Manual Controller ------------------ //

Server.start([
  // for example controller
  require("../controllers/ExampleController").default,
]);
