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

import useHttpClient from "src/api/useHttpClient";
import { GlobalStoreState } from "src/startup/GlobalStoreState";
import { StoreContext } from "redux-react-hook";
import { Token, SearchConfig, TokenSearchRequest, TokenSearchResponse } from "./types";
// import { useActionCreators as useTokenActionCreators } from "./redux";
import { useContext, useCallback } from "react";
import { Filter } from 'react-table';
import { useConfig } from 'src/startup/config';

interface Api {
  deleteToken: (tokenId: string) => Promise<void>;
  createToken: (email: string) => Promise<Token>;
  fetchApiKey: (tokenId: string) => Promise<Token>;
  performTokenSearch: (
    tokenSearchRequest: TokenSearchRequest
  ) => Promise<TokenSearchResponse>;
  toggleState: (tokenId: string, nextState: boolean) => Promise<void>;
}

export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const {
    httpGetJson,
    httpPostJsonResponse,
    httpDeleteEmptyResponse,
    httpGetEmptyResponse
  } = useHttpClient();
  const { tokenServiceUrl } = useConfig();
  if (!tokenServiceUrl) throw Error("Configuration not ready or misconfigured!");
  // const {
  //   toggleIsCreating,
  //   hideErrorMessage,
  //   showErrorMessage
  // } = useTokenActionCreators();

  return {
    deleteToken: useCallback((tokenId) => {
      const state: GlobalStoreState = store.getState();
      const url = `${tokenServiceUrl}/${tokenId}`;
      return httpDeleteEmptyResponse(url);
    }, []),

    createToken: useCallback(
      (email: string) => {
        const state: GlobalStoreState = store.getState();
        // toggleIsCreating();
        // hideErrorMessage();
        return httpPostJsonResponse(tokenServiceUrl, {
          body: JSON.stringify({
            userEmail: email,
            tokenType: "api",
            enabled: true
          })
        });
      },
      // [toggleIsCreating, hideErrorMessage, showErrorMessage]
      []
    ),

    fetchApiKey: useCallback((apiKeyId: string) => {
      const state: GlobalStoreState = store.getState();
      const url = `${tokenServiceUrl}/${apiKeyId}`;
      return httpGetJson(url);
    }, []),

    toggleState: useCallback((tokenId: string, nextState: boolean) => {
      const state: GlobalStoreState = store.getState();
      const url = `${
        tokenServiceUrl
        }/${tokenId}/state/?enabled=${nextState}`;
      return httpGetEmptyResponse(url);
    }, []),

    performTokenSearch: useCallback(
      (searchConfig: SearchConfig) => {
        const state: GlobalStoreState = store.getState();
        // // Default ordering and direction
        let orderBy = "issued_on";
        let orderDirection = "desc";

        if (!!searchConfig.sorting) {
          if (searchConfig.sorting.length > 0) {
            orderBy = searchConfig.sorting[0].id;
            orderDirection = searchConfig.sorting[0].desc ? "desc" : "asc";
          }
        }

        let filters = {} as { token_type: String };
        if (!!searchConfig.filters) {
          if (searchConfig.filters.length > 0) {
            searchConfig.filters.forEach((filter: Filter) => {
              filters[filter.id] = filter.value;
            });
          }
        }

        // We only want to see API keys, not user keys.
        filters.token_type = "API";

        const url = `${tokenServiceUrl}/search`;
        return httpPostJsonResponse(url, {
          body: JSON.stringify({
            page: searchConfig.page,
            limit: searchConfig.pageSize,
            orderBy,
            orderDirection,
            filters
          })
        });
      }, []
    )
  };
};


export default useApi;
