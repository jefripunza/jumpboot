interface Payload {
  statusCode: number;
  error: string;
  message: string;
}

interface Data {
  stack: string;
}

interface Headers {
  [key: string]: any;
}

interface Output {
  statusCode: number;
  payload: Payload;
  headers: Headers;
}

export interface ErrorWhatsApp {
  data: Data;
  isBoom: boolean;
  isServer: boolean;
  output: Output;
}
