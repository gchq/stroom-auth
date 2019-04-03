import { HttpRequest, HttpResponse } from "@pollyjs/adapter-fetch";

import { TestCache } from "../PollyDecorator";
import { Config } from "src/startup/config";
import { ResourceBuilder } from "./types";

const resourceBuilder: ResourceBuilder = (
  server: any,
  { authenticationServiceUrl }: Config,
  testCache: TestCache,
) => {
  server
    .get(`${authenticationServiceUrl}/idToken`)
    .intercept((req: HttpRequest, res: HttpResponse) => {
      const accessCode = req.params.accessCode;
      console.log("Trying access code", accessCode);

      res.sendStatus(200);
    });
};

export default resourceBuilder;
