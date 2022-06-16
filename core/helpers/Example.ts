import { Services, Page, isCompiled } from "..";

export const Example = {
  WelcomeScreen: (): any => {
    return isCompiled
      ? Services.Response.SuccessHTML("service is compiled!")
      : Services.Response.SuccessHTML(Page.Welcome());
  },
  Service: (method: string): any => {
    return Services.Response.Success(`example ${method}`);
  },
};
