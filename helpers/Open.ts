const { exec } = require("child_process");

export const Open = {
  New: {
    Tab: (url: string) => {
      const start =
        process.platform === "darwin"
          ? "open"
          : process.platform === "win32"
          ? "start"
          : "xdg-open";
      exec(`${start} ${url}`);
    },
  },
};
