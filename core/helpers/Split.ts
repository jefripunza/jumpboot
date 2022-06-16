export const Split = {
  FullName: {
    to: {
      FirstAndLastName: (full_name: string) => {
        const split = String(full_name).split(" ");
        const first_name = split[0];
        const last_name = split.filter((_, i) => i > 0).join(" ");
        return {
          first_name,
          last_name,
        };
      },
    },
  },
  CamelCase: (value: string) => {
    return String(value).replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  },
};
