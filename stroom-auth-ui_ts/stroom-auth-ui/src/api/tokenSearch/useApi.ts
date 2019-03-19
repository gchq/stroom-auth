import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";

import { useActionCreators } from "./redux";
import { HttpError } from "../../ErrorTypes";
// import { getJsonBody } from "../../modules/fetchFunctions";
import useHttpClient from "../useHttpClient";
import { useApi as useTokenApi } from "../tokens";
import { useActionCreators as useTokenSearchActionCreators } from "../tokenSearch";
import { GlobalStoreState } from '../../modules';

interface Api {
  performTokenSearch: (
    pageSize?: Number,
    page?: Number,
    sorted?: String,
    filtered?: String
  ) => void;
  setEnabledStateOnToken: (tokenId: String, isEnabled: boolean) => void;
}

const useApi = (): Api => {
  const store = useContext(StoreContext);
  const {} = useActionCreators();
  //   const { selectRow } = useUserSearchActionCreators();
  const {
    showSearchLoader,
    updateResults,
    changeLastUsedPageSize,
    changeLastUsedPage,
    changeLastUsedSorted,
    changeLastUsedFiltered
  } = useTokenSearchActionCreators();
  //   const { history } = useRouter();
  const { httpPostJsonResponse } = useHttpClient();
  const { toggleEnabledState } = useTokenApi();

  return {
    performTokenSearch: useCallback(
      (pageSize, page, sorted, filtered) => {
        const state:GlobalStoreState = store.getState();
        showSearchLoader(true);

        // if (pageSize === undefined) {
        //   pageSize = getState().tokenSearch.lastUsedPageSize
        // } else {
        //   dispatch({
        //     type: CHANGE_LAST_USED_PAGE_SIZE,
        //     lastUsedPageSize: pageSize
        //   })
        // }

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

        if (sorted.length > 0) {
          orderBy = sorted[0].id;
          orderDirection = sorted[0].desc ? "desc" : "asc";
        }

        let filters = {} as { token_type: String };
        if (filtered.length > 0) {
          filtered.forEach((filter: { id: string | number; value: any }) => {
            filters[filter.id] = filter.value;
          });
        }

        // We only want to see API keys, not user keys.
        filters.token_type = "API";

        const url = `${state.config.values.tokenServiceUrl}/search`;
        httpPostJsonResponse(url, {
          body: JSON.stringify({
            page,
            limit: pageSize,
            orderBy,
            orderDirection,
            filters
          })
        })
          // .then(handleStatus)
          // .then(getJsonBody)
          .then(data => {
            showSearchLoader(false);
            const { results, totalPages } = data;
            updateResults(results, totalPages);
          })
          // .catch(error => handleErrors(error));
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

    setEnabledStateOnToken: useCallback(
      (tokenId, isEnabled) => {
        const state:GlobalStoreState = store.getState();
        toggleEnabledState();
        const securityToken = state.authentication.idToken;
        fetch(
          `${
            state.config.values.tokenServiceUrl
          }/${tokenId}/state/?enabled=${isEnabled}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + securityToken
            },
            method: "get",
            mode: "cors"
          }
        )
          // .then(handleStatus)
          .catch(() => {
            // TODO Display alert to the user that changing the state failed
          });
      },
      [toggleEnabledState]
    )
  };
};

export default useApi;

// function handleStatus(response: any) {
//   if (response.status === 200) {
//     return Promise.resolve(response);
//   } else if (response.status === 409) {
//     return Promise.reject(
//       new HttpError(response.status, "This token already exists.")
//     );
//   } else {
//     return Promise.reject(new HttpError(response.status, response.statusText));
//   }
// }

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
