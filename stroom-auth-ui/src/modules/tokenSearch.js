import { HttpError } from '../ErrorTypes'
import { handleErrors, getJsonBody } from './fetchFunctions'

export const SHOW_SEARCH_LOADER = 'userSearch/SHOW_SEARCH_LOADER'
export const UPDATE_RESULTS = 'userSearch/UPDATE_RESULTS'
export const SELECT_ROW = 'userSearch/SELECT_ROW'

const initialState = {
  tokens: [],
  showSearchLoader: false,
  selectedTokenRowId: undefined
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
      if(state.selectedTokenRowId === action.selectedTokenRowId){
        return {
          ...state,
          selectedTokenRowId: undefined
        }
      }
      else {
        return {
          ...state,
          selectedTokenRowId: action.selectedTokenRowId
        }
      }
    default:
      return state
  }
}

export function updateResults(results){
  return {
    type: UPDATE_RESULTS,
    results
  }
}

export const performTokenSearch = (jwsToken, tableState) => {
  return dispatch => {

    var limit = tableState.pageSize
    var page = tableState.page

    //TODO ordering
    //var orderBy = tableState.sorted
    //var orderDirection = 'asc'

    var userSearchUrl = process.env.REACT_APP_TOKEN_URL + "/search"

    fetch(userSearchUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        page,
        limit,
        //TODO ordering
        // orderBy,
        // orderDirection
        //TODO filters
      })
    })
        .then(handleStatus)
        .then(getJsonBody)
        .then(data => {
          dispatch(updateResults(data))
        })
        .catch(error => handleErrors(error, dispatch, jwsToken))
  }
}

function handleStatus(response) {
  if(response.status === 200){
    return Promise.resolve(response)
  } else if(response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This token already exists.'))
  }
  else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}

export const changeSelectedRow = (tokenId) => {
  return dispatch => {
    dispatch({
      type: SELECT_ROW,
      selectedTokenRowId: tokenId
    })
  }
}
