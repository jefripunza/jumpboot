import { Validation, requireEnv, log_system } from "..";

import { createConnection } from "typeorm";

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
        log_system.running(
          "typeorm",
          `Database is connected! (${type}) (${database})`
        );
        return connect;
      })
      .catch((error) => {
        log_system.error("typeorm", `Error connection: ${error.message}`);
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
        log_system.error("mongodb", "Error connecting to MongoDB! ");
        if (first_db) {
          process.exit(1);
        }
      }
      log_system.running("mongodb", `Database Server is connected!`);
      first_db = false;
      client.close();
    });
  }
}

// --------------------------------------
// --> ORM use?

// TypeORM
import * as typeorm from "typeorm";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// add require
export const TypeORM = {
  Entity,
  PrimaryGeneratedColumn,
  Column,
};

// Builder

function createWhereSelector(where: typeorm.ObjectLiteral) {
  return Object.keys(where)
    .reduce((simpan: any, key) => {
      return [...simpan, `${key}=:${key}`];
    }, [])
    .join(" AND ");
}

function createWhereLikeSelector(where: typeorm.ObjectLiteral) {
  return Object.keys(where)
    .reduce((simpan: any, key) => {
      return [
        ...simpan,
        where[key] === "*" ? false : `LOWER(${key}) LIKE :${key}`,
      ];
    }, [])
    .filter((v: any) => {
      return v;
    })
    .join(" OR ");
}

type OrderBy = "ASC" | "DESC";

// =================================================================

export const Models = {
  // Create
  InputFrom: async (entity: typeorm.EntityTarget<any>, data: any) => {
    const new_data = [];
    if (Validation.isArray(data)) {
      new_data.push(...data);
    } else if (Validation.isObject(data)) {
      new_data.push(data);
    } else {
      throw new Error("please use Array Or Object to insert data!!!");
    }
    try {
      return await typeorm
        .getConnection()
        .createQueryBuilder()
        .insert()
        .into(entity)
        .values(new_data)
        .execute();
    } catch (error) {
      console.log({ error });
      return false;
    }
  },
  InputFromGetId: async (entity: typeorm.EntityTarget<any>, data: any) => {
    const new_data = [];
    if (Validation.isArray(data)) {
      new_data.push(...data);
    } else if (Validation.isObject(data)) {
      new_data.push(data);
    } else {
      throw new Error("please use Array Or Object to insert data!!!");
    }
    try {
      const result = await typeorm
        .getConnection()
        .createQueryBuilder()
        .insert()
        .into(entity)
        .values(new_data)
        .execute();
      return result.identifiers[0].id;
    } catch (error) {
      return false;
    }
  },
  /// -------------------------------
  // Read
  SelectFrom: async (
    entity: typeorm.EntityTarget<any>,
    where: typeorm.ObjectLiteral = {},
    option: { random?: boolean; orderBy?: OrderBy; limit?: number } = {}
  ) => {
    const query = typeorm
      .getRepository(entity)
      .createQueryBuilder()
      .where(createWhereSelector(where), where);
    if (option.random) {
      query.orderBy("RAND()");
    } else {
      if (option.orderBy) {
        query.orderBy("id", option.orderBy);
      }
    }
    if (option.limit) {
      query.limit(option.limit);
    }
    return query.getMany();
  },
  SoftSelectFrom: async (
    entity: typeorm.EntityTarget<any>,
    where: typeorm.ObjectLiteral = {},
    option: { random?: boolean; limit?: number } = {}
  ) => {
    const init_where = {
      ...where,
      is_deleted: false,
    };
    const query = typeorm
      .getRepository(entity)
      .createQueryBuilder()
      .where(createWhereSelector(init_where), init_where);
    if (option.random) {
      query.orderBy("RAND()");
    }
    if (option.limit) {
      query.limit(option.limit);
    }
    return query.getMany();
  },
  SelectFromIdRelation: async (
    entity: typeorm.EntityTarget<any>,
    id: number | string,
    relations: any
  ) => {
    return await typeorm
      .getRepository(entity)
      .findOne({ where: { id }, relations });
  },
  PaginationFrom: async (
    entity: typeorm.EntityTarget<any>,
    keywords: { [key: string]: string } | undefined = {},
    show: number | undefined = 10,
    page: number | undefined = 1,
    descending = false
  ) => {
    const default_value = {
      show: 10,
      page: 1,
    };
    const take = show
      ? show <= 0
        ? default_value.show
        : show
      : default_value.show;
    const _page = page
      ? page <= 0
        ? default_value.page
        : page
      : default_value.page;
    const skip = (_page - 1) * take;
    const keyword =
      typeof keywords === "object" && !Array.isArray(keywords)
        ? Object.keys(keywords)
            .filter((key) => keywords[key])
            .reduce((simpan, key) => {
              return {
                ...simpan,
                [key]:
                  keywords[key] === "*"
                    ? "*"
                    : `%${String(keywords[key]).toLowerCase()}%`,
              };
            }, {})
        : {};
    const orderBy = descending ? "DESC" : "ASC";

    const totalData = (
      await typeorm
        .getRepository(entity)
        .createQueryBuilder()
        .where(createWhereLikeSelector(keyword), keyword)
        .getMany()
    ).length;

    const data = await typeorm
      .getRepository(entity)
      .createQueryBuilder()
      .where(createWhereLikeSelector(keyword), keyword)
      .orderBy("id", orderBy)
      .skip(skip)
      .take(take)
      .getMany();

    // return data
    const lastPage = Math.ceil(totalData / show);
    const nextPage = _page + 1 > lastPage ? null : _page + 1;
    const prevPage = _page - 1 < 1 ? null : _page - 1;
    return {
      data,
      totalData,
      lastPage,
      prevPage,
      currentPage: _page,
      nextPage,
    };
  },
  SearchFrom: async (
    entity: typeorm.EntityTarget<any>,
    keywords: { [key: string]: string }
  ) => {
    const keyword =
      typeof keywords === "object" && !Array.isArray(keywords)
        ? Object.keys(keywords).reduce((simpan, key) => {
            return {
              ...simpan,
              [key]:
                keywords[key] === "*"
                  ? "*"
                  : `%${String(keywords[key]).toLowerCase()}%`,
            };
          }, {})
        : {};
    return await typeorm
      .getRepository(entity)
      .createQueryBuilder()
      .where(createWhereLikeSelector(keyword), keyword)
      .getMany();
  },
  /// -------------------------------
  // Update
  UpdateFrom: async (
    entity: typeorm.EntityTarget<any>,
    where: typeorm.ObjectLiteral,
    data: object
  ) => {
    return await typeorm
      .getConnection()
      .createQueryBuilder()
      .update(entity)
      .set(data)
      .where(createWhereSelector(where), where)
      .execute();
  },
  /// -------------------------------
  // Delete
  DeleteFrom: async (
    entity: typeorm.EntityTarget<any>,
    where: typeorm.ObjectLiteral
  ) => {
    const list_data = await typeorm
      .getRepository(entity)
      .createQueryBuilder()
      .where(createWhereSelector(where), where)
      .getMany();
    if (list_data.length > 0) {
      return await typeorm
        .getConnection()
        .createQueryBuilder()
        .delete()
        .from(entity)
        .where(createWhereSelector(where), where)
        .execute();
    }
    return false;
  },
  SoftDeleteFrom: async (
    entity: typeorm.EntityTarget<any>,
    where: typeorm.ObjectLiteral,
    reason: string | null = null
  ) => {
    const init_where = {
      ...where,
      is_deleted: false,
    };
    const soft_delete_data: any = {
      is_deleted: true,
      deleted_date: new Date(),
      delete_reason: reason,
    };
    const list_data = await typeorm
      .getRepository(entity)
      .createQueryBuilder()
      .where(createWhereSelector(init_where), init_where)
      .getMany();
    if (list_data.length > 0) {
      const result = await typeorm
        .getConnection()
        .createQueryBuilder()
        .update(entity)
        .set(soft_delete_data)
        .where(createWhereSelector(init_where), init_where)
        .execute();
      return result;
    }
    return false;
  },
  /// -------------------------------
  // Validation
  isLogin: async (
    entity: typeorm.EntityTarget<any>,
    where: typeorm.ObjectLiteral
  ) => {
    const list_data = await typeorm
      .getRepository(entity)
      .createQueryBuilder()
      .where(createWhereSelector(where), where)
      .getMany();
    if (list_data.length > 0) {
      return list_data[0];
    }
    return false;
  },
};

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Sequileze

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// MongoDB

import { MongoClient } from "mongodb";
import { ObjectID } from "bson";

export const ModelsMongo = {
  insertDocument: async (
    database: string,
    collection: string,
    new_data: object
  ) => {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    try {
      await monggodb.connect();
      //
      const coll = monggodb.db(database).collection(collection);
      if (
        typeof new_data === "object" &&
        Array.isArray(new_data) &&
        new_data !== null
      ) {
        // insertMany
        return await coll.insertMany(new_data);
      } else {
        return await coll.insertOne(new_data);
      }
    } finally {
      // Ensures that the monggodb will close when you finish/error
      await monggodb.close();
    }
  },
  showCollection: async (database: string, array_collection: string[]) => {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    try {
      await monggodb.connect();
      //
      const save: any = {};
      // eslint-disable-next-line @typescript-eslint/no-for-in-array
      for (const i in array_collection) {
        const coll = monggodb.db(database).collection(array_collection[i]);
        const result = await coll.find().toArray();
        save[array_collection[i]] = result;
      }
      return save;
    } finally {
      // Ensures that the monggodb will close when you finish/error
      await monggodb.close();
    }
  },
  listCollections: async (database: string) => {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    try {
      await monggodb.connect();
      //
      const db = monggodb.db(database);
      return (await db.listCollections().toArray()).map((collection) => {
        return collection.name;
      });
    } finally {
      // Ensures that the monggodb will close when you finish/error
      await monggodb.close();
    }
  },
  showDocumentByID: async (
    database: string,
    collection: string,
    _id: string
  ) => {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    try {
      await monggodb.connect();
      //
      const coll = monggodb.db(database).collection(collection);
      return await coll
        .find({
          _id: new ObjectID(_id),
        })
        .toArray();
    } finally {
      // Ensures that the monggodb will close when you finish/error
      await monggodb.close();
    }
  },
  updateDocumentByID: async (
    database: string,
    collection: string,
    _id: string,
    new_update: object
  ) => {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    try {
      await monggodb.connect();
      //
      const coll = monggodb.db(database).collection(collection);
      return await coll.updateOne(
        {
          _id: new ObjectID(_id),
        },
        {
          $set: {
            ...new_update,
          },
        }
      );
    } finally {
      // Ensures that the monggodb will close when you finish/error
      await monggodb.close();
    }
  },
  updateDocumentByObject: async (
    database: string,
    collection: string,
    select_object: object,
    new_update: object
  ) => {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    try {
      await monggodb.connect();
      //
      const coll = monggodb.db(database).collection(collection);
      return await coll.updateOne(
        {
          ...select_object,
        },
        {
          $set: {
            ...new_update,
          },
        }
      );
    } finally {
      // Ensures that the monggodb will close when you finish/error
      await monggodb.close();
    }
  },
  deleteDocument: async (
    database: string,
    collection: string,
    select: object | string
  ) => {
    const monggodb = new MongoClient(requireEnv("MONGODB"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    try {
      await monggodb.connect();
      //
      const coll = monggodb.db(database).collection(collection);
      if (
        typeof select === "object" &&
        !Array.isArray(select) &&
        select !== null
      ) {
        console.log("delete by object");
        return await coll.deleteMany({
          ...select,
        });
      } else {
        if (typeof select === "string") {
          return await coll.deleteOne({
            _id: new ObjectID(select),
          });
        } else {
          return false;
        }
      }
    } finally {
      // Ensures that the monggodb will close when you finish/error
      await monggodb.close();
    }
  },
};
