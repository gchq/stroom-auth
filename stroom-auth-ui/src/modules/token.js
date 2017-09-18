import { HttpError } from '../ErrorTypes'
import { handleErrors, getBody } from './fetchFunctions'
import { performUserSearch, changeSelectedRow } from './userSearch'

export const CHANGE_VISIBLE_CONTAINER = 'token/CHANGE_VISIBLE_CONTAINER'
export const TOGGLE_ALERT_VISIBILITY = 'user/TOGGLE_ALERT_VISIBILITY'


const initialState = {
  showAlert: false,
  alertText:''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_VISIBLE_CONTAINER:
      return {
        ...state,
        show: action.show
      }

    case TOGGLE_ALERT_VISIBILITY:
      const showAlert = !state.showAlert
      return {
        ...state,
        showAlert: showAlert,
        alertText: action.alertText
      }

    default:
      return state
  }
}

export function changeVisibleContainer(container) {
  return {
    type: CHANGE_VISIBLE_CONTAINER,
    show: container
  }
}

export function toggleAlertVisibility(alertText) {
  return {
    type: TOGGLE_ALERT_VISIBILITY,
    alertText: alertText
  }
}

export const deleteSelectedToken = (tokenId) => {
  return (dispatch, getState) => {
    const jwsToken = getState().login.token
    const tokenIdToDelete = getState().tokenSearch.selectedTokenRowId
    //TODO implement this
  //   var userServiceUrl = process.env.REACT_APP_USER_URL + "/" + tokenIdToDelete
  //   fetch(userServiceUrl, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization' : 'Bearer ' + jwsToken
  //     },
  //     method: 'delete',
  //     mode: 'cors'
  //   })
  //       .then(handleStatus)
  //       .then(getBody)
  //       .then(token => {
  //         dispatch(changeSelectedRow(tokenId))
  //         dispatch(performUserSearch(jwsToken))
  //         dispatch(toggleAlertVisibility("Token has been deleted"))
  //       })
  //       .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } else if(response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This token already exists!'))
  }
  else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}