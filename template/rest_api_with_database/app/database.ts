import { Database } from "../core";

// -------------------------------------------------------------- //
// ------------------- Import Manual Entities ------------------- //

const db = new Database();
db.mysql([
  // add here all entities...
  require("../models/entities/ExampleEntity").default,
]);
