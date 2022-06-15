import { Fetcher } from "jumpboot";

export default async (): Promise<any> => {
  const response = await Fetcher.delete({
    url: process.env.URL_HOSTNAME_TARGET + "/endpoint_target",
  });
  return response;
};
