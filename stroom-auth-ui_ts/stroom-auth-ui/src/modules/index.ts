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

import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
// import {reducer as formReducer} from 'redux-form';
import {authorisationReducer as authorisation, authenticationReducer as authentication} from '../startup/authentication';

import { reducer as config} from "../startup/config";
import { reducer as errorPage} from "../components/ErrorPage";
import { reducer as user} from "../api/users"
//import {
// authenticationReducer as authentication,
// authorisationReducer as authorisation,
// } from 'stroom-js';

 import login from './login';
//  import user from './user';
 import userSearch from './userSearch';
 import token from './token';
 import tokenSearch from './tokenSearch';



export default combineReducers({
  routing: routerReducer,
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
