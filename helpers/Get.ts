export const Get = {
  ip_address: (req: any) => {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  },
};
