import "reflect-metadata";
import * as http from "http";

import express, { Express, Request, Response } from "express";
import morgan from "morgan";

import { Fix, log, isProduction, Page, isCompiled } from "..";
import * as path from "path";
import * as fs from "fs";

export { Request, Response };

export const app: Express = express();
export const server = http.createServer(app);

// debug
app.use(morgan(isProduction ? "combined" : "dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ENDPOINT = process.env.ENDPOINT ? process.env.ENDPOINT : "";

const documentation_list: {
  name: any;
  prefix: any;
  routes: any[];
}[] = [];

const Controllers = {
  add: (controller: any) => {
    // This is our instantiated class
    const instance = new controller();
    // The prefix saved to our controller
    const get_prefix = Reflect.getMetadata("prefix", controller);
    const url_first_endpoint = get_prefix ? ENDPOINT + get_prefix : ENDPOINT;

    // Our `documentation & routes` array containing all our routes for this controller

    // Add meta documentation
    const documentation = Reflect.getMetadata("documentation", controller);
    // view renderer
    const routes = Reflect.getMetadata("routes", controller).map(
      (v: { methodName: any; documentation: any }) => {
        const function_name = v.methodName;
        if (documentation) {
          const doc = documentation.filter(
            (u: { methodName: any }) => u.methodName === function_name
          );
          if (doc.length > 0) {
            const doc_fix: any = doc[0];
            delete doc_fix.methodName;
            v.documentation = doc_fix;
          }
        }
        return v;
      }
    );
    if (documentation) {
      documentation_list.push({
        name: controller.name,
        prefix: Fix.UrlSlash(url_first_endpoint),
        routes,
      });
    }

    // Iterate over all routes and register them to our express application
    routes.forEach(
      (route: {
        requestMethod:
          | "all"
          | "get"
          | "post"
          | "put"
          | "patch"
          | "delete"
          | "options";
        path: string;
        methodName: string | number;
      }) => {
        // It would be a good idea at this point substitute the `app[route.requestMethod]` with a `switch/case` statement
        // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
        // this should be enough for now.
        app[route.requestMethod](
          Fix.UrlSlash(url_first_endpoint + route.path),
          (req: Request, res: Response) => {
            // Execute our method for this path and pass our express request and response object.
            instance[route.methodName](req, res);
          }
        );
      }
    );
  },
};

export const Server = {
  start: (list_controller: any[] = [], port = process.env.PORT || 8080) => {
    list_controller.forEach((controller) => {
      Controllers.add(controller);
    });
    setTimeout(() => {
      server.listen(port, () => {
        log.running("express", `Server Listen at port : ${port}`);

        // open new tab
        // Open.New.Tab(`http://localhost:${port}`);

        // static framework assets
        if (!isCompiled) {
          app.use(
            "/jumpboot",
            express.static(path.join(__dirname, "..", "assets"))
          );
        }

        // page not found
        app.get("*", (req: Request, res: Response) => {
          const { originalUrl } = req;
          return res.status(404).send(Page.Error404(originalUrl));
        });
      });
    }, 100);
  },
};
