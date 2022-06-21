import { Fetcher } from "../core";

interface Body {
  id: string | number;
}
export default async (body: Body): Promise<any> => {
  const response = await Fetcher.put({
    url: process.env.URL_HOSTNAME_TARGET + "/endpoint_target",
    body,
  });
  return response;
};
