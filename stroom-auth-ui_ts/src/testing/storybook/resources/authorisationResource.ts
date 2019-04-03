import { HttpRequest, HttpResponse } from "@pollyjs/adapter-fetch";

import { TestCache } from "../PollyDecorator";
import { Config } from "src/startup/config";
import { ResourceBuilder } from "./types";

const resourceBuilder: ResourceBuilder = (
  server: any,
  { authorisationServiceUrl }: Config,
  testCache: TestCache,
) => {
  server
    .post(`${authorisationServiceUrl}/hasAppPermission`)
    .intercept((req: HttpRequest, res: HttpResponse) => {
      const { permissionName } = JSON.parse(req.body);
      if (testCache.data!.allAppPermissions.includes(permissionName)) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    });
};

export default resourceBuilder;
