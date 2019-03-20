/*
 * Copyright 2019 Crown Copyright
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
import { StoreContext } from "redux-react-hook";
import { useContext, useCallback } from "react";

import useHttpClient from "../useHttpClient";
import { User } from "./types";
import { GlobalStoreState } from "../../modules/GlobalStoreState";
import { useActionCreators } from "./redux";

//FIXME: make a type for editedUser
interface Api {
  add: (user: User) => Promise<void>;
  remove: (userId: string) => Promise<void>;
  fetch: (userId: String) => Promise<User[]>;
  change: (user: User) => Promise<void>;
}
// TODO: all the useCallback functions in one function is disgusting. The functions need splitting out.
export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const {
    httpPutEmptyResponse,
    httpGetJson,
    httpPostJsonResponse,
    httpDeleteEmptyResponse
  } = useHttpClient();

  const change = useCallback(user => {
    const reduxState: GlobalStoreState = store.getState();
    const url = `${reduxState.config.values.userServiceUrl}/${user.id}`;
    return httpPutEmptyResponse(url, {
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        comments: user.comments,
        state: user.state,
        never_expires: user.never_expires,
        force_password_change: user.force_password_change
      })
    });
  }, []);

  const add = useCallback(user => {
    const reduxState: GlobalStoreState = store.getState();

    const url = reduxState.config.values.userServiceUrl;
    return httpPostJsonResponse(url, {
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        comments: user.comments,
        state: user.state,
        never_expires: user.never_expires,
        force_password_change: user.force_password_change
      })
    });
  }, []);

  /**
   * Delete user
   */
  const remove = useCallback((userId: string) => {
    const state: GlobalStoreState = store.getState();
    const url = `${state.config.values.userServiceUrl}/${userId}`;
    return httpDeleteEmptyResponse(url, {});
  }, []);

  /**
   * Fetch a user
   */
  const fetch = useCallback((userId: String) => {
    const state: GlobalStoreState = store.getState();
    const url = `${state.config.values.userServiceUrl}/${userId}`;
    return httpGetJson(url);
  }, []);

  return {
    add,
    fetch,
    remove,
    change
  } as Api;
};

export default useApi;
