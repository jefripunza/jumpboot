import { Fetcher } from "jumpboot";

interface Body {
  id: string | number;
}
export default async (body: Body): Promise<any> => {
  const response = await Fetcher.post({
    url: process.env.URL_HOSTNAME_TARGET + "/endpoint_target",
    body,
  });
  return response;
};
