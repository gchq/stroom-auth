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

import { useCallback, useContext } from "react";
import { StoreContext } from "redux-react-hook";

import useHttpClient from "../useHttpClient";
import { GlobalStoreState } from "../../modules";
import { User } from "../users";

interface Api {
  getUsers: () => Promise<Array<User>>;
}

export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { httpGetJson } = useHttpClient();

  return {
    getUsers: useCallback(() => {
      const state: GlobalStoreState = store.getState();
      const url = `${state.config.values.userServiceUrl}/?fromEmail=&usersPerPage=100&orderBy=id`;
      return httpGetJson(url);
    }, [httpGetJson])
  };
};

export default useApi;
