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
import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";
import { HttpError } from "../../ErrorTypes";
import {
  handleErrors,
  getJsonBody,
  getBody
} from "../../modules/fetchFunctions";
import {
  useApi as useUserSearchApi,
  useActionCreators as useUserSearchActionCreators
} from "../userSearch";
import useHttpClient from "../useHttpClient";
import { useApi as useTokenSearchApi } from "../tokenSearch";
import { useActionCreators as useTokenActionCreators } from "./redux";
import useRouter from "../../lib/useRouter";
// import { User } from "../users";
import { GlobalStoreState } from "src/modules/GlobalStoreState";

interface Api {
  deleteSelectedToken: (tokenId: String) => void;
  createToken: (email: String, setSubmitting: any) => void;
  fetchApiKey: (apiKeyId: String) => void;
  userAutoCompleteChange: (
    autocompleteText: String,
    securityToken: String
  ) => void;
  toggleEnabledState: () => void;
}

export const useApi = (): Api => {
  const store: GlobalStoreState = useContext(StoreContext);
  const { performUserSearch } = useUserSearchApi();
  const { selectRow } = useUserSearchActionCreators();
  const { performTokenSearch } = useTokenSearchApi();
  const { history } = useRouter();
  const { httpDeleteJsonResponse } = useHttpClient();
  const {
    toggleState,
    toggleIsCreating,
    updateMatchingAutoCompleteResults,
    hideErrorMessage,
    showErrorMessage,
    changeReadCreatedToken
  } = useTokenActionCreators();

  return {
    deleteSelectedToken: useCallback(
      tokenId => {
        const tokenIdToDelete = store.tokenSearch.selectedTokenRowId;
        const url = `${store.config.values.tokenServiceUrl}/${tokenIdToDelete}`;
        httpDeleteJsonResponse(url)
          .then(handleStatus)
          .then(getBody)
          .then(() => {
            selectRow(tokenId);
            performTokenSearch();
          })
          .catch(error => handleErrors(error)); //FIXME
      },
      [selectRow, performTokenSearch]
    ),

    createToken: useCallback(
      ({ email, setSubmitting }) => {
        toggleIsCreating();
        hideErrorMessage();
        const jwsToken = store.authentication.idToken;

        //TODO: Replace with helper
        fetch(store.config.values.tokenServiceUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwsToken
          },
          method: "post",
          mode: "cors",
          body: JSON.stringify({
            userEmail: email,
            tokenType: "api",
            enabled: true
          })
        })
          .then(handleStatus)
          .then(getJsonBody)
          .then(newToken => {
            toggleIsCreating();
            history.push(`/token/${newToken.id}`);
            setSubmitting(false);
          })
          .catch(error => {
            toggleIsCreating();
            handleErrors(error); //FIXME
            if (error.status === 400) {
              showErrorMessage(
                "There is no such user! Please select one from the dropdown."
              );
            }
          });
      },
      [toggleIsCreating, hideErrorMessage, showErrorMessage]
    ),
    fetchApiKey: useCallback(
      apiKeyId => {
        const jwsToken = store.authentication.idToken;
        // TODO: remove any errors
        // TODO: show loading spinner
        //TODO: Replace with helper
        fetch(`${store.config.values.tokenServiceUrl}/${apiKeyId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwsToken
          },
          method: "get",
          mode: "cors"
        })
          .then(handleStatus)
          .then(getJsonBody)
          .then(apiKey => {
            changeReadCreatedToken(apiKey);
          })
          .catch(error => handleErrors(error)); //FIXME
      },
      [changeReadCreatedToken]
    ),
    userAutoCompleteChange: useCallback(
      ({ autocompleteText, securityToken }) => {
        performUserSearch();
        let matchingAutoCompleteResults: String[] = [];
        const autoCompleteSuggestionLimit = 10; // We want to avoid having a vast drop-down box
        store.userSearch.results.forEach(result => {
          if (
            result.email.indexOf(autocompleteText) !== -1 &&
            matchingAutoCompleteResults.length <= autoCompleteSuggestionLimit
          ) {
            matchingAutoCompleteResults.push(result.email);
          }
        });
        updateMatchingAutoCompleteResults(matchingAutoCompleteResults);
      },
      [performUserSearch, updateMatchingAutoCompleteResults]
    ),
    toggleEnabledState: useCallback(() => {
      const tokenId = store.token.lastReadToken.id;
      const nextState = store.token.lastReadToken.enabled ? "false" : "true";
      const securityToken = store.authentication.idToken;
      //TODO: Replace with helper
      fetch(
        `${
          store.config.values.tokenServiceUrl
        }/${tokenId}/state/?enabled=${nextState}`,
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
        .then(() => {
          toggleState();
        })
        .catch(() => {
          // TODO Show the user an error
        });
    }, [toggleState])
  };
};

function handleStatus(response: any) {
  if (response.status === 200) {
    return Promise.resolve(response);
  } else if (response.status === 409) {
    return Promise.reject(
      new HttpError(response.status, "This token already exists!")
    );
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText));
  }
}

export default useApi;
