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
import { Action } from "redux";
import {
  prepareReducer,
  genUseActionCreators
} from "../../lib/redux-actions-ts";
import useHttpClient from "../../api/useHttpClient";
import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";
import { Config } from "./types";

const initialState = { values: {}, isReady: false };

const UPDATE_CONFIG = "UPDATE_CONFIG";

interface UpdateConfigAction extends Action<"UPDATE_CONFIG"> {
  values: Config;
}

const useActionCreators = genUseActionCreators({
  updateConfig: (values: Config): UpdateConfigAction => ({
    type: UPDATE_CONFIG,
    values
  })
});

const reducer = prepareReducer(initialState)
  .handleAction<UpdateConfigAction>(UPDATE_CONFIG, (_, { values }) => ({
    isReady: true,
    values: values
  }))
  .getReducer();

interface Api {
  fetchConfig: () => void;
}

const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { httpGetJson } = useHttpClient();
  const { updateConfig } = useActionCreators();

  if (!store) {
    throw new Error("Could not get Redux Store for processing Thunks");
  }

  const fetchConfig = useCallback(() => {
    const url = "/config.json";
    httpGetJson(url, {}, false).then(updateConfig);
  }, [httpGetJson, updateConfig]);

  return { fetchConfig };
};

export { reducer, Api, useApi };
