export const CREATE_REQUEST = 'user/CREATE_REQUEST'
export const CREATE_RESPONSE = 'user/CREATE_RESPONSE'

const initialState = {
  user: '',
  password: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REQUEST:
      return {
        ...state,
        //TODO mark something as 'creating'
      }
    case CREATE_RESPONSE:
      return {
        ...state
        //TODO change creating to 'created' or something similar
      }

    default:
      return state
  }
}

export const attemptCreate = (name, password, jwsToken) => {
  return dispatch => {
    // Do a POST of the data to create a thing.

    var userServiceUrl = process.env.REACT_APP_USER_URL
    // Call the authentication service to get a token.
    // If successful we re-direct to Stroom, otherwise we display a message.
    fetch(userServiceUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + jwsToken
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        name,
        password
      })
    })
      // .then(handleErrors)
      .then(result => result.text())
      .then(whatsThisGoingToBe => {
        //TODO dispatch the ending action to disable the spinner
        console.log(whatsThisGoingToBe)
      })
    
    //TODO dispatch somewhere in the above. Should save the token just in case.
  }
}