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
import { GlobalStoreState } from "src/startup/GlobalStoreState";
import { StoreContext } from "redux-react-hook";
import { Token } from "./types";
import { useActionCreators as useTokenActionCreators } from "./redux";
import { useContext, useCallback } from "react";
import { TokenSearchRequest, TokenSearchResponse } from '../tokenSearch/types';
import { useActionCreators as useTokenSearchActionCreators } from "../tokenSearch";
import { Filter } from 'react-table';

interface Api {
  deleteSelectedToken: () => Promise<void>;
  createToken: (email: string) => Promise<Token>;
  fetchApiKey: (tokenId: string) => Promise<Token>;
  /** Will toggle the last token read if there's no tokenId passed. Uses last read token otherwise */
  toggleEnabledState: () => Promise<Token>;
  performTokenSearch: (
    tokenSearchRequest: TokenSearchRequest
  ) => Promise<TokenSearchResponse>;
  toggleState: (tokenId: string) => Promise<void>;
}

export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const {
    httpGetJson,
    httpPostJsonResponse,
    httpDeleteEmptyResponse,
    httpGetEmptyResponse
  } = useHttpClient();
  const {
    toggleIsCreating,
    hideErrorMessage,
    showErrorMessage
  } = useTokenActionCreators();

  const {
    showSearchLoader,
    updateResults,
    changeLastUsedPageSize,
    changeLastUsedPage,
    changeLastUsedSorted,
    changeLastUsedFiltered
  } = useTokenSearchActionCreators();

  return {
    deleteSelectedToken: useCallback(() => {
      const state: GlobalStoreState = store.getState();
      const tokenIdToDelete = state.tokenSearch.selectedTokenRowId;
      const url = `${state.config.values.tokenServiceUrl}/${tokenIdToDelete}`;
      return httpDeleteEmptyResponse(url);
    }, []),

    createToken: useCallback(
      (email: string) => {
        const state: GlobalStoreState = store.getState();
        toggleIsCreating();
        hideErrorMessage();
        return httpPostJsonResponse(state.config.values.tokenServiceUrl, {
          body: JSON.stringify({
            userEmail: email,
            tokenType: "api",
            enabled: true
          })
        });
      },
      [toggleIsCreating, hideErrorMessage, showErrorMessage]
    ),

    fetchApiKey: useCallback((apiKeyId: string) => {
      const state: GlobalStoreState = store.getState();
      const url = `${state.config.values.tokenServiceUrl}/${apiKeyId}`;
      return httpGetJson(url);
    }, []),

    toggleEnabledState: useCallback(() => {
      const state: GlobalStoreState = store.getState();
      const nextState = state.token.lastReadToken.enabled ? "false" : "true";
      const tokenId = state.token.lastReadToken.id;
      const url = `${
        state.config.values.tokenServiceUrl
        }/${tokenId}/state/?enabled=${nextState}`;
      return httpGetEmptyResponse(url);
    }, []),

    toggleState: useCallback((tokenId: string) => {
      const state: GlobalStoreState = store.getState();
      const token: Token | undefined = state.tokenSearch.results.find(
        token => token.id === tokenId
      );
      if (!!token) {
        const nextState = !token.enabled;
        const url = `${
          state.config.values.tokenServiceUrl
          }/${tokenId}/state/?enabled=${nextState}`;
        return httpGetEmptyResponse(url);
      } else {
        throw Error(
          `Can't toggle token ${tokenId} because it's not in our store!`
        );
      }
    }, []),

    performTokenSearch: useCallback(
      (tokenSearchRequest: TokenSearchRequest) => {
        const state: GlobalStoreState = store.getState();
        showSearchLoader(true);

        // if (pageSize === undefined) {
        //   pageSize = getState().tokenSearch.lastUsedPageSize
        // } else {
        //   dispatch({
        //     type: CHANGE_LAST_USED_PAGE_SIZE,
        //     lastUsedPageSize: pageSize
        //   })
        // }
        let { page, pageSize, sorted, filtered } = tokenSearchRequest;

        pageSize = getRowsPerPage();
        changeLastUsedPageSize(pageSize);

        if (page === undefined) {
          page = state.tokenSearch.lastUsedPage;
        } else {
          changeLastUsedPage(page);
        }

        if (sorted === undefined) {
          sorted = state.tokenSearch.lastUsedSorted;
        } else {
          changeLastUsedSorted(sorted);
        }

        if (filtered === undefined) {
          filtered = state.tokenSearch.lastUsedFiltered;
        } else {
          changeLastUsedFiltered(filtered);
        }

        // Default ordering and direction
        let orderBy = "issued_on";
        let orderDirection = "desc";

        if (!!sorted) {
          if (sorted.length > 0) {
            orderBy = sorted[0].id;
            orderDirection = sorted[0].desc ? "desc" : "asc";
          }
        }

        let filters = {} as { token_type: String };
        if (!!filtered) {
          if (filtered.length > 0) {
            filtered.forEach((filter: Filter) => {
              filters[filter.id] = filter.value;
            });
          }
        }

        // We only want to see API keys, not user keys.
        filters.token_type = "API";

        const url = `${state.config.values.tokenServiceUrl}/search`;
        return httpPostJsonResponse(url, {
          body: JSON.stringify({
            page,
            limit: pageSize,
            orderBy,
            orderDirection,
            filters
          })
        });
      },
      [
        updateResults,
        showSearchLoader,
        changeLastUsedFiltered,
        changeLastUsedPage,
        changeLastUsedPageSize,
        changeLastUsedSorted
      ]
    )
  };
};

export const getRowsPerPage = () => {
  const viewport = document.getElementById("User-content");
  let rowsInViewport = 20;
  if (viewport) {
    const viewportHeight = viewport.offsetHeight;
    const rowsHeight = viewportHeight - 60;
    rowsInViewport = Math.floor(rowsHeight / 26);
  }
  return rowsInViewport;
};

export default useApi;
