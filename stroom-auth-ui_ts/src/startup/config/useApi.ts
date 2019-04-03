/*
 * Copyright 2018 Crown Copyright
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
import { Config } from "./types";
import useHttpClient from 'src/api/useHttpClient';

interface Api {
  fetchConfig: () => Promise<Config>;
}

const useApi = (): Api => {
  const { httpGetJson } = useHttpClient();

  const fetchConfig = React.useCallback(() => {
    return httpGetJson("/config.json", {}, false);
  }, [httpGetJson]);

  return { fetchConfig };
};

export { Api, useApi };

export default useApi;
