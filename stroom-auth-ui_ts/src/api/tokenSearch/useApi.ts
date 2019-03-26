import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";

import { useActionCreators } from "./redux";
import useHttpClient from "../useHttpClient";
import { useActionCreators as useTokenSearchActionCreators } from "../tokenSearch";
import { GlobalStoreState } from '../../modules';
import { Filter } from 'react-table';
import { TokenSearchRequest, TokenSearchResponse } from './types'
import { Token } from '../tokens';

interface Api {
  performTokenSearch: (tokenSearchRequest: TokenSearchRequest) => Promise<TokenSearchResponse>;
  toggleState: (tokenId: string) => Promise<void>;
}

const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { } = useActionCreators();
  const {
    showSearchLoader,
    updateResults,
    changeLastUsedPageSize,
    changeLastUsedPage,
    changeLastUsedSorted,
    changeLastUsedFiltered
  } = useTokenSearchActionCreators();
  const { httpGetEmptyResponse, httpPostJsonResponse } = useHttpClient();

  return {
    toggleState: useCallback(
      (tokenId: string) => {
        const state: GlobalStoreState = store.getState();
        const token: Token | undefined = state.tokenSearch.results.find((token) => token.id === tokenId);
        if (!!token) {
          const nextState = !token.enabled;
          const url = `${state.config.values.tokenServiceUrl}/${tokenId}/state/?enabled=${nextState}`
          return httpGetEmptyResponse(url);
        }
        else { throw Error(`Can't toggle token ${tokenId} because it's not in our store!`) }
      }, []
    ),
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
        })
      },
      [
        updateResults,
        showSearchLoader,
        changeLastUsedFiltered,
        changeLastUsedPage,
        changeLastUsedPageSize,
        changeLastUsedSorted
      ]
    ),
  };
};

export default useApi;

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
