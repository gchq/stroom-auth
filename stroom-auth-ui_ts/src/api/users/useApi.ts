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
import { GlobalStoreState } from "../../startup/GlobalStoreState";
import { User } from "./types";

interface Api {
  add: (user: User) => Promise<void>;
  change: (user: User) => Promise<void>;
  fetch: (userId: String) => Promise<User[]>;
  fetchCurrentUser: () => Promise<User[]>;
  remove: (userId: string) => Promise<void>;
}

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

  const fetchCurrentUser = useCallback(() => {
    const state: GlobalStoreState = store.getState();
    const url = `${state.config.values.userServiceUrl}/me`;
    return httpGetJson(url);
  }, []);

  return {
    add,
    fetch,
    fetchCurrentUser,
    remove,
    change
  };
};

export default useApi;
