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
import { useCallback , useContext} from "react";
import { StoreContext } from "redux-react-hook";
import { useActionCreators } from "./redux";
import useHttpClient from "../useHttpClient";
import {User} from '../users';
// import { HttpError } from "../../ErrorTypes";
// import { getJsonBody } from "../../modules/fetchFunctions";
import { GlobalStoreState } from '../../modules';

interface Api {
  performUserSearch: (state:GlobalStoreState) => void;
    getUsers: () => Promise<Array<User>>;
}

export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { showSearchLoader, updateResults } = useActionCreators();

      const { httpGetJson } = useHttpClient();
  return {
    performUserSearch: useCallback((state:GlobalStoreState) => {
      // const state:GlobalStoreState = store.getState();
      showSearchLoader(true);
      const url = `${
        state.config.values.userServiceUrl
      }/?fromEmail=&usersPerPage=100&orderBy=id`;
      const { httpGetJson } = useHttpClient();
      httpGetJson(url)
        // .then(handleStatus)
        // .then(getJsonBody)
        .then(data => {
          showSearchLoader(false);
          updateResults(data);
        })
        // .catch(error => {throw new Error(error)}); 
    }, [showSearchLoader, updateResults]),
    getUsers: useCallback(() => {
      const state:GlobalStoreState = store.getState();
      // showSearchLoader(true);
      const url = `${
        state.config.values.userServiceUrl
      }/?fromEmail=&usersPerPage=100&orderBy=id`;
      return httpGetJson(url)
        // .then(handleStatus)
        // .then(getJsonBody)
        // .then(data => {
          // showSearchLoader(false);
          // updateResults(data);
        // })
        // .catch(error => {throw new Error(error)}); 
    },[httpGetJson])
  };
};

export default useApi;

// function handleStatus(response: any) {
//   if (response.status === 200) {
//     return Promise.resolve(response);
//   } else if (response.status === 409) {
//     return Promise.reject(
//       new HttpError(
//         response.status,
//         "This user already exists - please use a different email address."
//       )
//     );
//   } else {
//     return Promise.reject(new HttpError(response.status, response.statusText));
//   }
// }
