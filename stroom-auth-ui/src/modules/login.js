import { push } from 'react-router-redux'

export const USERNAME_CHANGE = 'login/USERNAME_CHANGE'
export const PASSWORD_CHANGE = 'login/PASSWORD_CHANGE'
export const TOKEN_CHANGE = 'login/TOKEN_CHANGE'
export const DELETE_TOKEN = 'login/DELETE_TOKEN'

const initialState = {
  token: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case USERNAME_CHANGE:
      return {
        ...state,
        username: action.username
      }

    case TOKEN_CHANGE: 
      return {
        ...state,
        token: action.token
      }
    case DELETE_TOKEN:
      return {
        ...state,
        token: ''
      }
    default:
      return state
  }
}

export function changeToken(token) {
  return {
    type: TOKEN_CHANGE,
    token: token
  }
}

export const attempLogin = (username, password, referrer) => {
  return dispatch => {
    var loginServiceUrl = process.env.REACT_APP_LOGIN_URL
    // Call the authentication service to get a token.
    // If successful we re-direct to Stroom, otherwise we display a message.
    fetch(loginServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        username,
        password
      })
    })
      // .then(handleErrors)
      .then(result => result.text())
      .then(token => {
        dispatch(changeToken(token))        
        if(referrer === "stroom"){
          //TODO use authorisation header
          var loginUrl = process.env.REACT_APP_STROOM_UI_URL + '/?token=' + token
          window.location.href = loginUrl
        }
        else if(referrer === "") {
          dispatch(push('/'))
        }
        else {
          dispatch(push(referrer))
        }
      })    
  }
}

export function deleteToken() {
  return {
    type: DELETE_TOKEN
  }
}

export const logout = () => {
    return dispatch => {
      dispatch(deleteToken())
    }
}