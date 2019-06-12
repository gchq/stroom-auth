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

import { push } from 'react-router-redux'
import jwtDecode from 'jwt-decode'

//TODO: Either have this handle more errors or rename it to handleUnauthorized
export function handleErrors (error, dispatch, token) {
  if (error.status === 401) {
    const decodedToken = jwtDecode(token)
    const now = new Date().getTime() / 1000
    const expiredToken = decodedToken.exp <= now
    if (expiredToken) {
      dispatch(push('/s/unauthorised?reason=expired_token'))
    } else {
      // If it's not expired then that means this user is genuinely unauthorised
      dispatch(push('/s/unauthorised'))
    }
  } else {
    // dispatch(errorAdd(error.status, error.message))
  }
}

export function getBody (response) {
  return response.text()
}

export function getJsonBody (response) {
  return response.json()
}
