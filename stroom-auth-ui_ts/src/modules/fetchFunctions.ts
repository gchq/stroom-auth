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

import * as jwtDecode from 'jwt-decode'
import { StoreContext } from "redux-react-hook";
import { useContext } from "react";
import useRouter from '../lib/useRouter';
import { GlobalStoreState } from '.';
import {useActionCreators } from '../components/ErrorPage';

export const handleErrors = (error: any) => {
  const store = useContext(StoreContext);
  const { history } = useRouter();
  const state: GlobalStoreState = store.getState();
  const token = state.authentication.idToken;
  const {setErrorMessage, setHttpErrorCode} = useActionCreators();

  if (error.status === 401) {
    if (!!token) {
      const decodedToken:any = jwtDecode(token)
      const now = new Date().getTime() / 1000
      const expiredToken = decodedToken.exp <= now
      if (expiredToken) {
        history.push('/unauthorised?reason=expired_token');
      } else {
        // If it's not expired then that means this user is genuinely unauthorised
        history.push('/unauthorised');
      }
    } else {
        history.push('/unauthorised?reason=missing_token');
    }
  } else {
    setErrorMessage('API request was rejected!');
    setHttpErrorCode(error.status);
    history.push('/error');
  }
}

export function getJsonBody(response:any) {
  return response.json()
}
