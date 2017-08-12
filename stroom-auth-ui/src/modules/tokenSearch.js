import { HttpError } from '../ErrorTypes'
import { handleErrors, getJsonBody } from './fetchFunctions'

export const SHOW_SEARCH_LOADER = 'tokenSearch/SHOW_SEARCH_LOADER'
export const UPDATE_RESULTS = 'tokenSearch/UPDATE_RESULTS'
export const SELECT_ROW = 'tokenSearch/SELECT_ROW'

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

export function showSearchLoader(showSearchLoader){
  return {
    type: SHOW_SEARCH_LOADER,
    showSearchLoader
  }
}

export const performTokenSearch = (jwsToken, tableState) => {
  return dispatch => {
    dispatch(showSearchLoader(true))

    var limit = tableState.pageSize
    var page = tableState.page
    
    // Default ordering and direction
    var orderBy = 'issued_on'
    var orderDirection = 'desc'

    if(tableState.sorted.length > 0){
      orderBy = tableState.sorted[0].id
      orderDirection = tableState.sorted[0].desc ? 'desc' : 'asc'
    }

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
        orderBy,
        orderDirection
        //TODO filters
      })
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
