import {
  Request,
  Response,
  RestController,
  Controller,
  GetMapping,
  PostMapping,
  PutMapping,
  PatchMapping,
  DeleteMapping,
  ValidateBody,
  Example,
} from "jumpboot";

// Services
// import * as TargetCamelCaseService from "../services/TargetCamelCaseService";

@RestController("/target-url-endpoint")
export default class TargetCamelCaseController {
  @ValidateBody({})
  @PostMapping("/")
  public async addTargetCamelCase(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("POST"));
    controller.render();
  }

  @GetMapping("/")
  public async getTargetCamelCase(req: Request, res: Response) {
    const controller = new Controller(res, await Example.WelcomeScreen());
    controller.render();
  }

  @ValidateBody({})
  @PutMapping("/")
  public async editTargetCamelCase(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("PUT"));
    controller.render();
  }

  @ValidateBody({})
  @PatchMapping("/")
  public async updateSpecificTargetCamelCase(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("PATCH"));
    controller.render();
  }

  @DeleteMapping("/")
  public async removeTargetCamelCase(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("DELETE"));
    controller.render();
  }
}
