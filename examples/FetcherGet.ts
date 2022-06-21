import { Fetcher } from "../core";

export default async (): Promise<any> => {
  const response = await Fetcher.get({
    url: process.env.URL_HOSTNAME_TARGET + "/endpoint_target",
  });
  return response;
};
