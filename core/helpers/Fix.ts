export const Fix = {
  FirstZeros: (value: number) => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return (value < 10 ? "0" : "") + value;
  },
  UrlSlash: (url: string): any => {
    const text = String(String(url).startsWith("/") ? url : `/${url}`).replace(
      /\/\//gi,
      "/"
    );
    return String(text).includes("//") ? Fix.UrlSlash(text) : text;
  },
};
