
export const USERNAME_CHANGE = 'login/USERNAME_CHANGE'
export const PASSWORD_CHANGE = 'login/PASSWORD_CHANGE'

const initialState = {
  jwsToken: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case USERNAME_CHANGE:
      return {
        ...state,
        username: action.username
      }

    default:
      return state
  }
}

export const attempLogin = (username, password) => {
  return dispatch => {

    var authServiceUrl = process.env.REACT_APP_STROOM_AUTH_SERVICE_URL
    // Call the authentication service to get a token.
    // If successful we re-direct to Stroom, otherwise we display a message.
    fetch(authServiceUrl, {
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
        var loginUrl = process.env.REACT_APP_STROOM_UI_URL + '/?token=' + token
        window.location.href = loginUrl
      })
    
    //TODO dispatch somewhere in the above. Should save the token just in case.
  }
}