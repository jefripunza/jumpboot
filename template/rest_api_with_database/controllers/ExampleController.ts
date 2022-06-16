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
} from "../core";

// Services
import * as ExampleService from "../services/ExampleService";

@RestController("/")
export default class ExampleController {
  @ValidateBody({})
  @PostMapping("/")
  public async addExample(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("POST"));
    controller.render();
  }

  @GetMapping("/")
  public async getExample(req: Request, res: Response) {
    const controller = new Controller(res, await Example.WelcomeScreen());
    controller.render();
  }

  @ValidateBody({})
  @PutMapping("/")
  public async editExample(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("PUT"));
    controller.render();
  }

  @ValidateBody({})
  @PatchMapping("/")
  public async updateSpecificExample(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("PATCH"));
    controller.render();
  }

  @DeleteMapping("/")
  public async removeExample(req: Request, res: Response) {
    const controller = new Controller(res, await Example.Service("DELETE"));
    controller.render();
  }
}
