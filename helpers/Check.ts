export const Check = {
  Hosting: {
    Active: async (url: string) => {
      return await new Promise((resolve) => {
        require("dns").resolve4(url, function (_: any, addresses: unknown) {
          if (addresses) {
            resolve(addresses);
          } else {
            resolve(false);
          }
        });
      });
    },
  },
};
