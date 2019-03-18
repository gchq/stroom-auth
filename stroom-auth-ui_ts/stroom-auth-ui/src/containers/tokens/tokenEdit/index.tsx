/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import TokenEditUi from "./TokenEditUi";
import { useApi as useTokenApi } from "../../../api/tokens";
import useHttpQueryParam from "../../../lib/useHttpQueryParam";

//TODO: merge this into the main token edit page
const TokenEditForm = () => {
  const { fetchApiKey } = useTokenApi();
  const tokenId = useHttpQueryParam("tokenId");
  React.useEffect(() => {
    if (!!tokenId) {
      fetchApiKey(tokenId);
    }
  }, []);

  return <TokenEditUi />;
};

export default TokenEditForm;
