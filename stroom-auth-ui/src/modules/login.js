//TODO delete the actions and action types because they're not doing anything
export const USERNAME_CHANGE = 'login/USERNAME_CHANGE'
export const PASSWORD_CHANGE = 'login/PASSWORD_CHANGE'
export const TOKEN_CHANGE = 'login/TOKEN_CHANGE'

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

export const attempLogin = (username, password, referer, routerHistory) => {
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
        if(referer){
          //TODO Redirect to referer, including authorisation header and token, as is convention.
          var loginUrl = process.env.REACT_APP_STROOM_UI_URL + '/?token=' + token
          window.location.href = loginUrl
        }
        else{
          routerHistory.push('/')
        }
      })
    
    //TODO dispatch somewhere in the above. Should save the token just in case.
  }
}