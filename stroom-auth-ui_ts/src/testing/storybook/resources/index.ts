import { ResourceBuilder } from "./types";

import authenticationResource from "./authenticationResource";
import authorisationResource from "./authorisationResource";

const resourceBuilders: ResourceBuilder[] = [
  authenticationResource,
  authorisationResource,
];

export default resourceBuilders;
