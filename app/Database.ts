import { requireEnv, log } from "../";

import { createConnection } from "typeorm";
import { MongoClient } from "mongodb";

// type DatabaseType =
//   | "aurora-mysql"
//   | "aurora-postgres"
//   | "better-sqlite3"
//   | "capacitor"
//   | "cockroachdb"
//   | "cordova"
//   | "expo"
//   | "mariadb"
//   | "mongodb"
//   | "mssql"
//   | "mysql"
//   | "nativescript"
//   | "oracle"
//   | "postgres"
//   | "react-native"
//   | "sap"
//   | "spanner"
//   | "sqlite"
//   | "sqljs";

export class Database {
  public async customConnection(
    type: any,
    port: number,
    list_entities: any[]
  ): Promise<any> {
    const entities: any[] = [];
    list_entities.forEach((entity) => {
      entities.push(entity);
    });

    // env
    const host: string = requireEnv("DB_HOST", "localhost");
    const username: string = requireEnv("DB_USER", "root");
    const password: string = process.env.DB_PASS || "";
    const database: string = requireEnv("DB_NAME", "dbname");
    const synchronize: boolean = requireEnv("DB_SYNC", "true") === "true";
    const logging: boolean = requireEnv("DB_LOG", "true") === "true";

    await createConnection({
      name: "default",
      type,
      port,
      host, // penting
      username, // penting
      password, // penting
      database, // penting
      synchronize,
      logging,
      entities,
      subscribers: [],
      migrations: [],
    })
      .then((connect) => {
        log.running(
          "typeorm",
          `Database is connected! (${type}) (${database})`
        );
        return connect;
      })
      .catch((error) => {
        log.error("typeorm", `Error connection: ${error.message}`);
        process.exit(1);
        // return error
      });
  }

  public async mysql(list_entities: any[], custom_port = 3306) {
    return this.customConnection("mysql", custom_port, list_entities);
  }
  public async postgres(list_entities: any[], custom_port = 5432) {
    return this.customConnection("postgres", custom_port, list_entities);
  }

  // -----------------------------------------------------------
  public async mongodb() {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    let first_db = true;
    monggodb.connect((error, client: any) => {
      if (error) {
        console.log({ error });
        log.error("mongodb", "Error connecting to MongoDB! ");
        if (first_db) {
          process.exit(1);
        }
      }
      log.running("mongodb", `Database Server is connected!`);
      first_db = false;
      client.close();
    });
  }
}
