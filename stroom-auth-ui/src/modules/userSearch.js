import { HttpError } from '../ErrorTypes'
import { handleErrors, getJsonBody } from './fetchFunctions'

export const SHOW_SEARCH_LOADER = 'userSearch/SHOW_SEARCH_LOADER'
export const UPDATE_RESULTS = 'userSearch/UPDATE_RESULTS'
export const SELECT_ROW = 'userSearch/SELECT_ROW'

const initialState = {
  users: [],
  showSearchLoader: false,
  selectedUserRowId: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SEARCH_LOADER:
      return {
        ...state,
        showSearchLoader: action.showSearchLoader
      }
    case UPDATE_RESULTS:
      return {
        ...state,
        results: action.results
      }
    case SELECT_ROW:
      if(state.selectedUserRowId === action.selectedUserRowId){
        return {
          ...state,
          selectedUserRowId: undefined
        }
      }
      else {
        return {
          ...state,
          selectedUserRowId: action.selectedUserRowId
        }
      }
    default:
      return state
  }
}

export function showSearchLoader(showSearchLoader){
  return {
    type: SHOW_SEARCH_LOADER,
    showSearchLoader
  }
}
 
export function updateResults(results){
  return {
    type: UPDATE_RESULTS,
    results
  }
}

export const performUserSearch = (jwsToken) => {
  return dispatch => {
    dispatch(showSearchLoader(true))

    var userSearchUrl = process.env.REACT_APP_USER_URL + '/?fromEmail=&usersPerPage=100&orderBy=id'
    fetch(userSearchUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'get',
      mode: 'cors'
    })
    .then(handleStatus)
    .then(getJsonBody)
    .then(data => {
      dispatch(showSearchLoader(false))
      dispatch(updateResults(data))
    })
    .catch(error => handleErrors(error, dispatch, jwsToken))    
  }
}

export const changeSelectedRow = (userId) => {
  return dispatch => {
    dispatch({
      type: SELECT_ROW,
      selectedUserRowId: userId
    })
  }
}

function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } else if(response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This user already exists - please use a different email address.'))
  }
  else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}
