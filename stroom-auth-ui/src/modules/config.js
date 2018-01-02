/*
 * Copyright 2018 Crown Copyright
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

export const UPDATE_CONFIG = 'config/UPDATE_CONFIG'

const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      return {
        ...state,
        authenticationServiceUrl: action.config.authenticationServiceUrl,
        userServiceUrl: action.config.userServiceUrl,
        tokenServiceUrl: action.config.tokenServiceUrl,
        authorisationServiceUrl: action.config.authorisationServiceUrl,
        stroomUiUrl: action.config.stroomUiUrl,
        advertisedUrl: action.config.advertisedUrl,
        rootPath: action.config.rootPath,
        appClientId: action.config.appClientId
      }
    default:
      return state
  }
}

function updateConfig (config) {
  return {
    type: UPDATE_CONFIG,
    config
  }
}

export const fetchConfig = () => {
  return (dispatch) => {
    fetch('config.json', {method: 'get'})
    .then(response => response.json())
    .then(config => dispatch(updateConfig(config)))
  }
}
