export const Convert = {
  Text: {
    Original: {
      to: {
        CapitalizeFirstLetter: (str: string) => {
          return str
            .split(" ")
            .map((a: string | any[]) => {
              return a[0].toUpperCase() + a.slice(1);
            })
            .join(" ");
        },
      },
    },
    // ---------------------------------------------------------------------
    Space: {
      to: {
        CamelCase: (str: any) =>
          String(str)
            .split("_")
            .join(" ")
            .split("-")
            .join(" ")
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/\s+/g, ""),
      },
    },
    // ---------------------------------------------------------------------
    CamelCase: {
      to: {
        Title: (str: any) =>
          String(str)
            .replace(/([A-Z])/g, (match) => " " + match)
            .split(" ")
            .map((text) =>
              String(text).replace(/^./, (match) => match.toUpperCase())
            )
            .join(" ")
            .replace(/  /gi, " ")
            .trim(),
        SnakeCase: (str: any) =>
          String(str)
            .replace(/[A-Z]/g, (letter) => `_${String(letter).toLowerCase()}`)
            .split("")
            .filter((_, i) => i > 0)
            .join(""),
      },
    },
    // ---------------------------------------------------------------------
    All: {
      to: {
        AllFormat: (name: any) => {
          // init
          let new_name = name;

          // remove extension (js, ts)
          if (String(new_name).includes(".")) {
            new_name = String(new_name).split(".")[0];
          }

          // remove topic of first input
          new_name = String(new_name)
            .replace(/Controller/g, "")
            .replace(/controller/g, "")
            .replace(/Service/g, "")
            .replace(/service/g, "")
            .replace(/Entities/g, "")
            .replace(/entities/g, "")
            .replace(/Entity/g, "")
            .replace(/entity/g, "")
            .replace(/Repository/g, "")
            .replace(/repository/g, "");

          // to camel case
          const camelcase = Convert.Text.Space.to.CamelCase(new_name);

          const title = Convert.Text.CamelCase.to.Title(new_name);

          // save camel case
          const snakecase = Convert.Text.CamelCase.to.SnakeCase(camelcase);

          // for path rest controller
          const url_path = String(snakecase).toLowerCase().split("_").join("-");

          // render
          const render = {
            title,
            camelcase,
            snakecase,
            url_path,
          };
          // console.log({ render }); // debug
          return render;
        },
      },
    },
  },
  // ---------------------------------------------------------------------
  String: {
    only: {
      number: (text: string): number => {
        return parseInt(String(text).replace(/\D/g, ""));
      },
    },
  },
  Number: {
    only: {
      alphabet: (text: string) => {
        return String(text).replace(/[^a-zA-Z]+/g, "");
      },
    },
  },
};
