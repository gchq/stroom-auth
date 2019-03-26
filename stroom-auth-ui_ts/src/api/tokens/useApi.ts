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

import useHttpClient from "../useHttpClient";
import { GlobalStoreState } from "../../modules/GlobalStoreState";
import { StoreContext } from "redux-react-hook";
import { Token } from './types';
import { useActionCreators as useTokenActionCreators } from "./redux";
import { useContext, useCallback } from "react";

interface Api {
  deleteSelectedToken: () => Promise<void>;
  createToken: (email: string) => Promise<Token>;
  fetchApiKey: (tokenId: string) => Promise<Token>;
  /** Will toggle the last token read if there's no tokenId passed. Uses last read token otherwise */
  toggleEnabledState: () => Promise<Token>;
}

export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { httpGetJson, httpPostJsonResponse, httpDeleteEmptyResponse, httpGetEmptyResponse } = useHttpClient();
  const {
    toggleIsCreating,
    hideErrorMessage,
    showErrorMessage,
  } = useTokenActionCreators();

  return {

    deleteSelectedToken: useCallback(
      () => {
        const state: GlobalStoreState = store.getState();
        const tokenIdToDelete = state.tokenSearch.selectedTokenRowId;
        const url = `${state.config.values.tokenServiceUrl}/${tokenIdToDelete}`;
        return httpDeleteEmptyResponse(url);
      }, []
    ),

    createToken: useCallback(
      (email: string) => {
        const state: GlobalStoreState = store.getState();
        toggleIsCreating();
        hideErrorMessage();
        return httpPostJsonResponse(
          state.config.values.tokenServiceUrl,
          {
            body: JSON.stringify({
              userEmail: email,
              tokenType: "api",
              enabled: true
            })
          }
        );
      },
      [toggleIsCreating, hideErrorMessage, showErrorMessage]
    ),

    fetchApiKey: useCallback(
      (apiKeyId: string) => {
        const state: GlobalStoreState = store.getState();
        const url = `${state.config.values.tokenServiceUrl}/${apiKeyId}`;
        return httpGetJson(url);
      }, []
    ),

    toggleEnabledState: useCallback(
      () => {
        const state: GlobalStoreState = store.getState();
        const nextState = state.token.lastReadToken.enabled ? "false" : "true";
        const tokenId = state.token.lastReadToken.id;
        const url = `${state.config.values.tokenServiceUrl}/${tokenId}/state/?enabled=${nextState}`
        return httpGetEmptyResponse(url);
      }, []
    )

  };
};

export default useApi;
