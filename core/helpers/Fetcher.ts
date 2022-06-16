import axios, { AxiosResponse } from "axios";

interface DynamicString {
  [key: string]: string;
}

interface GetAndDelete {
  url: string;
  token?: string | boolean;
  headers?: DynamicString;
}
interface PostAndPut {
  url: string;
  token?: string | boolean;
  body?: object;
  headers?: DynamicString;
}
export const Fetcher = {
  get: async ({ url, token = false, headers = {} }: GetAndDelete) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.get(url, { headers }));
  },
  post: async ({ url, token = false, body = {}, headers = {} }: PostAndPut) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.post(url, body, { headers }));
  },
  put: async ({ url, token = false, body = {}, headers = {} }: PostAndPut) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.put(url, body, { headers }));
  },
  patch: async ({
    url,
    token = false,
    body = {},
    headers = {},
  }: PostAndPut) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.patch(url, body, { headers }));
  },
  delete: async ({ url, token = false, headers = {} }: GetAndDelete) => {
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return await handler(axios.delete(url, { headers }));
  },
};

async function handler(response: any) {
  return new Promise(async (resolve, reject) => {
    response
      .catch(function (error: {
        response: {
          status: any;
          data: { message: any };
          headers: any;
        };
        code?: string;
      }) {
        if (error?.response?.status) {
          reject({
            status: error.response.status,
            message: error.response.data.message,
            headers: error.response.headers,
          });
        } else {
          reject({ message: error.code });
        }
      })
      .then((result: AxiosResponse) => {
        try {
          return result.data;
        } catch (error) {
          reject(error);
        }
      })
      .then((result: unknown) => resolve(result));
  });
}
