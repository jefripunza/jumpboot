import { Response } from "express";

interface ResponseService {
  code: number;
  status?: string;
  message?: string;
  render?: { [key: string]: any };
  html?: string;
}

export class Controller {
  constructor(res: Response, service: ResponseService) {
    this._res = res;
    this._service = service;
  }

  // validate(cb: () => { code: number; message: string } | boolean) {
  //   const result = cb();
  //   if (typeof result === "object" && !Array.isArray(result)) {
  //     const { code, message } = result;
  //     return this._res.status(code).json({ status: "error", message });
  //   }
  // }

  render() {
    const { code, status, message, render, html } = this._service;
    if (render) {
      return this._res.status(code).json(render);
    }
    if (html) {
      return this._res.status(code).send(html);
    }
    return this._res.status(code).json({
      status,
      message,
    });
  }

  private _res: Response;
  private _service: ResponseService;
}
