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

import { combineReducers } from 'redux';

import { authorisationReducer as authorisation, authenticationReducer as authentication } from '../startup/authentication';
import { reducer as config } from "../startup/config";

import { reducer as errorPage } from "../components/ErrorPage";

import { reducer as user } from "../api/users"
import { reducer as login } from "../api/users"
import { reducer as userSearch } from '../api/userSearch';
import { reducer as token } from '../api/tokens';
import { reducer as tokenSearch } from '../api/tokenSearch';
import {GlobalStoreState }from './GlobalStoreState';

export {GlobalStoreState};
export default combineReducers({
  login,
  errorPage,
  user,
  userSearch,
  token,
  tokenSearch,
  authentication,
  authorisation,
  config,
  // form: formReducer,
});
