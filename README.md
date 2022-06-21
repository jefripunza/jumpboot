# JUMPBOOT

**Simple, Fast, and Customable**

![banner](https://raw.githubusercontent.com/jefripunza/jumpboot/main/core/static/img/BANNER.jpg)

[Link Framework][url_jumpboot]


| Application | Description                                                                     | Link                                                                     |
|-------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| NodeJS      | JavaScript environment to run javascript outside browser                        | [download & install](https://nodejs.org/en/)                             |
| Typescript  | JavaScript replacement language for better development needs                    | [doc](https://www.typescriptlang.org/docs/)                              |
| Yarn        | Easier to use package manager than **NPM**                                      | [doc](https://yarnpkg.com/getting-started/usage)                         |
| PM2         | process manager for running microservices                                       | [doc](https://pm2.keymetrics.io/docs/usage/quick-start/)                 |
| Nodemon     | auto reload service if project is saved (for development only)                  | [doc](https://www.npmjs.com/package/nodemon)                             |
| ExpressJS   | web app framework for **NodeJS** written in the JavaScript programming language | [doc](https://expressjs.com/en/starter/basic-routing.html)               |
| TypeORM     | make it easier to create applications using rational-based databases            | [doc](https://typeorm.io/#/connection-options/common-connection-options) |

<br />

---

<br />

### Install Global Dependencies (if not installed) (first user? WAJIB BOY...)

```bash

npm i -g nodemon yarn cross-env typescript ts-node pm2

```

---

<br/>

### How to Use

1. install these dependencies globally with (only once):

```bash

npm i -g jumpboot

```

2. run this command to get all menus:

```bash

jumpboot

```

Note : Use arrow keys (up & down) to select menu

### Menu Description

- init
> initiate a new project

<br/>

- create
> create necessary files such as controller, service, repository, entity, fetcher, middleware and other files

<br/>

- git
> all git commands are here

<br/>

---

<br/>

### All Script App

```bash
// ---------------------------------------------------------
// Development

//-> start project (development)

npm run dev

// or

yarn dev

// or

nodemon


//-> eslint test

yarn lint


//-> clean all error file

yarn clean


//-> delete node_modules and install again

yarn reset


//-> build !!!

npm run build

// or

yarn build


// ---------------------------------------------------------
// Production (if you have finished build project)

//-> start project (default)

npm run start

// or

yarn start


//-> start microservice (pm2)

yarn ms


//-> stop microservice (pm2)

yarn ms:stop


//-> reload microservice (pm2)

yarn ms:reload


//-> remove from list microservice (pm2)

yarn ms:remove

```

---

<br/>


# Closing

you can check update this framework on [website !][url_jumpboot]

2020 &copy; [Jefri Herdi Triyanto][url_jefripunza]

[url_jefripunza]: https://portofolio.jefripunza.repl.co "Jefri Herdi Triyanto"
[url_jumpboot]: https://github.com/jefripunza/jumpboot "Jumpboot Official"
