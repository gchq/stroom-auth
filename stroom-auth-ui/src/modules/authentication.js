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

import jwtDecode from 'jwt-decode'
import Cookies from 'cookies-js'
import uuidv4 from 'uuid/v4'
import sjcl from 'sjcl'

import { relativePush } from '../relativePush'
import { getBody } from './fetchFunctions'
import { canManageUsers } from './authorisation'

export const TOKEN_ID_CHANGE = 'authentication/TOKEN_ID_CHANGE'

const initialState = {
  idToken: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOKEN_ID_CHANGE:
      return {
        ...state,
        idToken: action.idToken
      }
    default:
      return state
  }
}

function changeIdToken (idToken) {
  return {
    type: TOKEN_ID_CHANGE,
    idToken
  }
}

export const sendAuthenticationRequest = (referrer) => {
  return (dispatch, getState) => {
    const clientId = process.env.REACT_APP_CLIENT_ID
    const redirectUrl = process.env.REACT_APP_ADVERTISED_URL + '/handleAuthenticationResponse'
    const state = ''

    // Get or create sessionId and cookie
    let sessionId = Cookies.get('sessionId')
    // TODO: No - we need to leave it to the AuthenticationService. Also change this in Stroom.
    if (sessionId === undefined) {
      // If we don't have a cookie we need to create one.
      sessionId = uuidv4()
      Cookies.set('sessionId', sessionId)
    }

    // Create nonce and store, and create nonce hash
    const nonce = uuidv4()
    const nonceHashBytes = sjcl.hash.sha256.hash(nonce)
    const nonceHash = sjcl.codec.hex.fromBits(nonceHashBytes)
    localStorage.setItem('nonce', nonce)

    // We need to remember where the user was going
    localStorage.setItem('preAuthenticationRequestReferrer', referrer)

    // Compose the new URL
    // TODO: if we don't pass a sessionId we will always get a login request (?). We could use this for persistent login.
    const authenticationRequestParams = `?scope=openid&response_type=code&client_id=${clientId}&redirect_url=${redirectUrl}&state=${state}&nonce=${nonceHash}&sessionId=${sessionId}`
    const authenticationRequestUrl = process.env.REACT_APP_AUTHENTICATION_URL + '/authenticate/' + authenticationRequestParams

    // We hand off to the authenticationService.
    window.location.href = authenticationRequestUrl
  }
}

export const handleAuthenticationResponse = (accessCode, sessionId) => {
  return (dispatch) => {
    const idTokenRequestUrl = process.env.REACT_APP_AUTHENTICATION_URL + '/idToken'

    // If we're not passed a sessionId we will have one from when we submitted the request.
    // TODO: change the AuthenticationService so that it doesn't redirect with a sessionId?
    if (sessionId === undefined) {
      sessionId = Cookies.get('sessionId')
    }

    fetch(idTokenRequestUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        sessionId,
        accessCode,
        requestingClientId: process.env.REACT_APP_CLIENT_ID
      })
    })
    .then(getBody)
    .then(idToken => {
      const decodedToken = jwtDecode(idToken)
      const nonce = localStorage.getItem('nonce')
      const nonceHashBytes = sjcl.hash.sha256.hash(nonce)
      const nonceHash = sjcl.codec.hex.fromBits(nonceHashBytes)
      const returnedNonce = decodedToken.nonce
      const referrer = localStorage.getItem('preAuthenticationRequestReferrer')

      if (nonceHash === returnedNonce) {
        localStorage.removeItem('nonce')
        localStorage.removeItem('preAuthenticationRequestReferrer')
        dispatch(changeIdToken(idToken))
        dispatch(canManageUsers(idToken))
      } else {
        console.error('Nonce does not match.')
        // We fall through and push to the referrer, which will mean we attempt log in again.
        // Possibly we could add an error message here, so the user can understand why they
        // are being asked to log in again.
      }
      dispatch(relativePush(referrer))
    })
  }
}
