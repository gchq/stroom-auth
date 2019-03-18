import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";
import { useActionCreators } from "./redux";
import { HttpError } from "../../ErrorTypes";
import { handleErrors, getJsonBody } from "../../modules/fetchFunctions";
import useHttpClient from "../useHttpClient";
// import { useActionCreators as useUserSearchActionCreators } from "../userSearch";
import {
  useApi as useTokenApi
  // useActionCreators as useTokenActionCreators
} from "../tokens";
import {
  // useApi as useTokenSearchApi,
  useActionCreators as useTokenSearchActionCreators
} from "../tokenSearch";
// import useRouter from "../../lib/useRouter";

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
          page = store.tokenSearch.lastUsedPage;
        } else {
          changeLastUsedPage(page);
        }

        if (sorted === undefined) {
          sorted = store.tokenSearch.lastUsedSorted;
        } else {
          changeLastUsedSorted(sorted);
        }

        if (filtered === undefined) {
          filtered = store.tokenSearch.lastUsedFiltered;
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

        const url = `${store.config.tokenServiceUrl}/search`;
        httpPostJsonResponse(url, {
          body: JSON.stringify({
            page,
            limit: pageSize,
            orderBy,
            orderDirection,
            filters
          })
        })
          .then(handleStatus)
          .then(getJsonBody)
          .then(data => {
            showSearchLoader(false);
            const { results, totalPages } = data;
            updateResults(results, totalPages);
          })
          .catch(error => handleErrors(error)); //FIXME
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
        toggleEnabledState();
        const securityToken = store.authentication.idToken;
        fetch(
          `${
            store.config.tokenServiceUrl
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
          .then(handleStatus)
          .catch(() => {
            // TODO Display alert to the user that changing the state failed
          });
      },
      [toggleEnabledState]
    )
  };
};

export default useApi;

function handleStatus(response: any) {
  if (response.status === 200) {
    return Promise.resolve(response);
  } else if (response.status === 409) {
    return Promise.reject(
      new HttpError(response.status, "This token already exists.")
    );
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText));
  }
}

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

// import { useContext, useCallback } from "react";
// import { StoreContext } from "redux-react-hook";
// import { useActionCreators } from "./redux";
// import useHttpClient from "../useHttpClient"
// import { HttpError } from "../../ErrorTypes";
// import { handleErrors, getJsonBody, getBody } from "../../modules/fetchFunctions";
// import { useActionCreators as useUserSearchActionCreators} from '../userSearch';
// import { useApi as useTokenSearchApi} from '../tokenSearch';
// import {useActionCreators as useTokenActionCreators} from './redux';
// import useRouter from "../../lib/useRouter";
// import { performUserSearch } from 'src/modules/userSearch_old';

// interface Api {
// }

// export const useApi = (): Api => {
//     const store = useContext(StoreContext);
//     const { } = useActionCreators();
//     const {selectRow} = useUserSearchActionCreators();
//     const {performTokenSearch} = useTokenSearchApi();
//     const {history} = useRouter();
//     const {toggleState, toggleIsCreating, updateMatchingAutoCompleteResults, hideErrorMessage, showErrorMessage, changeReadCreatedToken} = useTokenActionCreators();

//     const deleteSelectedToken = useCallback((tokenId) => {
//             const jwsToken = store.authentication.idToken;
//             const tokenIdToDelete = store.tokenSearch.selectedTokenRowId;
//             //TODO: Replace with helper
//             fetch(`${store.config.tokenServiceUrl}/${tokenIdToDelete}`, {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                     Authorization: 'Bearer ' + jwsToken,
//                 },
//                 method: 'delete',
//                 mode: 'cors',
//             })
//                 .then(handleStatus)
//                 .then(getBody)
//                 .then(() => {
//                     selectRow(tokenId);
//                     performTokenSearch(jwsToken);
//                 })
//                 .catch(error => handleErrors(error));//FIXME
//         }, [selectRow, performTokenSearch]);

//     const createToken = useCallback((email, setSubmitting) => {
//             toggleIsCreating();
//             hideErrorMessage();
//             const jwsToken = store.authentication.idToken;

//             //TODO: Replace with helper
//             fetch(store.config.tokenServiceUrl, {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                     Authorization: 'Bearer ' + jwsToken,
//                 },
//                 method: 'post',
//                 mode: 'cors',
//                 body: JSON.stringify({
//                     userEmail: email,
//                     tokenType: 'api',
//                     enabled: true,
//                 }),
//             })
//                 .then(handleStatus)
//                 .then(getJsonBody)
//                 .then(newToken => {
//                     toggleIsCreating();
//                     history.push(`/token/${newToken.id}`);
//                     setSubmitting(false);
//                 })
//                 .catch(error => {
//                     toggleIsCreating();
//                     handleErrors(error);//FIXME
//                     if (error.status === 400) {
//                             showErrorMessage(
//                                 'There is no such user! Please select one from the dropdown.',
//                             );
//                     }
//                 });
//     },[toggleIsCreating, hideErrorMessage, showErrorMessage]);

//     const fetchApiKey = useCallback((apiKeyId) => {
//             const jwsToken = store.authentication.idToken;
//             // TODO: remove any errors
//             // TODO: show loading spinner
//             //TODO: Replace with helper
//             fetch(`${store.config.tokenServiceUrl}/${apiKeyId}`, {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                     Authorization: 'Bearer ' + jwsToken,
//                 },
//                 method: 'get',
//                 mode: 'cors',
//             })
//                 .then(handleStatus)
//                 .then(getJsonBody)
//                 .then(apiKey => {
//                     changeReadCreatedToken(apiKey);
//                 })
//                 .catch(error => handleErrors(error));//FIXME
//     },[changeReadCreatedToken]);

//     const userAutoCompleteChange = useCallback((autocompleteText, securityToken) => {
//             performUserSearch(securityToken);
//             let matchingAutoCompleteResults = [];
//             const autoCompleteSuggestionLimit = 10; // We want to avoid having a vast drop-down box
//             store.userSearch.results.forEach(result => {
//                 if (
//                     result.email.indexOf(autocompleteText) !== -1 &&
//                     matchingAutoCompleteResults.length <= autoCompleteSuggestionLimit
//                 ) {
//                     matchingAutoCompleteResults.push(result.email);
//                 }
//             });
//             updateMatchingAutoCompleteResults(matchingAutoCompleteResults);
//     },[performUserSearch, updateMatchingAutoCompleteResults]);

//     const toggleEnabledState = useCallback(() => {
//             const tokenId = store.token.lastReadToken.id;
//             const nextState = store.token.lastReadToken.enabled ? 'false' : 'true';
//             const securityToken = store.authentication.idToken;
//             //TODO: Replace with helper
//             fetch(
//                 `${
//                 store.config.tokenServiceUrl
//                 }/${tokenId}/state/?enabled=${nextState}`,
//                 {
//                     headers: {
//                         Accept: 'application/json',
//                         'Content-Type': 'application/json',
//                         Authorization: 'Bearer ' + securityToken,
//                     },
//                     method: 'get',
//                     mode: 'cors',
//                 },
//             )
//                 .then(handleStatus)
//                 .then(() => {
//                     toggleState();
//                 })
//                 .catch(() => {
//                     // TODO Show the user an error
//                 });
//         }, [toggleState]);
// }

//     function handleStatus(response) {
//         if (response.status === 200) {
//             return Promise.resolve(response);
//         } else if (response.status === 409) {
//             return Promise.reject(
//                 new HttpError(response.status, 'This token already exists!'),
//             );
//         } else {
//             return Promise.reject(new HttpError(response.status, response.statusText));
//         }
//     }

// export default useApi;
