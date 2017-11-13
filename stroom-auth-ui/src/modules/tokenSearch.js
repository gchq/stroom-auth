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
import { tokenServiceUrl } from '../environmentVariables'
import { HttpError } from '../ErrorTypes'
import { handleErrors, getJsonBody } from './fetchFunctions'
import { toggleAlertVisibility } from './token'

export const SHOW_SEARCH_LOADER = 'tokenSearch/SHOW_SEARCH_LOADER'
export const UPDATE_RESULTS = 'tokenSearch/UPDATE_RESULTS'
export const SELECT_ROW = 'tokenSearch/SELECT_ROW'
export const CHANGE_LAST_USED_PAGE_SIZE = 'tokenSearch/CHANGE_LAST_USED_PAGE_SIZE'
export const CHANGE_LAST_USED_PAGE = 'tokenSearch/CHANGE_LAST_USED_PAGE'
export const CHANGE_LAST_USED_SORTED = 'tokenSearch/CHANGE_LAST_USED_SORTED'
export const CHANGE_LAST_USED_FILTERED = 'tokenSearch/CHANGE_LAST_USED_FILTERED'

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
        results: action.results,
        totalPages: action.totalPages
      }
    case SELECT_ROW:
      if (state.selectedTokenRowId === action.selectedTokenRowId) {
        return {
          ...state,
          selectedTokenRowId: undefined
        }
      } else {
        return {
          ...state,
          selectedTokenRowId: action.selectedTokenRowId
        }
      }
    case CHANGE_LAST_USED_PAGE_SIZE:
      return {
        ...state,
        lastUsedPageSize: action.lastUsedPageSize
      }
    case CHANGE_LAST_USED_PAGE:
      return {
        ...state,
        lastUsedPage: action.lastUsedPage
      }
    case CHANGE_LAST_USED_SORTED:
      return {
        ...state,
        lastUsedSorted: action.lastUsedSorted
      }
    case CHANGE_LAST_USED_FILTERED:
      return {
        ...state,
        lastUsedFiltered: action.lastUsedFiltered
      }
    default:
      return state
  }
}

function updateResults (data) {
  return {
    type: UPDATE_RESULTS,
    results: data.tokens,
    totalPages: data.totalPages
  }
}

export function showSearchLoader (showSearchLoader) {
  return {
    type: SHOW_SEARCH_LOADER,
    showSearchLoader
  }
}

export const performTokenSearch = (jwsToken, pageSize, page, sorted, filtered) => {
  return (dispatch, getState) => {
    dispatch(showSearchLoader(true))

    if (pageSize === undefined) {
      pageSize = getState().tokenSearch.lastUsedPageSize
    } else {
      dispatch({
        type: CHANGE_LAST_USED_PAGE_SIZE,
        lastUsedPageSize: pageSize
      })
    }

    if (page === undefined) {
      page = getState().tokenSearch.lastUsedPage
    } else {
      dispatch({
        type: CHANGE_LAST_USED_PAGE,
        lastUsedPage: page
      })
    }

    if (sorted === undefined) {
      sorted = getState().tokenSearch.lastUsedSorted
    } else {
      dispatch({
        type: CHANGE_LAST_USED_SORTED,
        lastUsedSorted: sorted
      })
    }

    if (filtered === undefined) {
      filtered = getState().tokenSearch.lastUsedFiltered
    } else {
      dispatch({
        type: CHANGE_LAST_USED_FILTERED,
        lastUsedFiltered: filtered
      })
    }

    // Default ordering and direction
    let orderBy = 'issued_on'
    let orderDirection = 'desc'

    if (sorted.length > 0) {
      orderBy = sorted[0].id
      orderDirection = sorted[0].desc ? 'desc' : 'asc'
    }

    let filters = {}
    if (filtered.length > 0) {
      filtered.forEach(filter => {
        filters[filter.id] = filter.value
      })
    }

    // We only want to see API keys, not user keys.
    filters.token_type = 'API'

    const body = filters
        ? JSON.stringify({
          page,
          limit: pageSize,
          orderBy,
          orderDirection,
          filters
        })
        : JSON.stringify({
          page,
          limit: pageSize,
          orderBy,
          orderDirection
        })

    fetch(`${tokenServiceUrl()}/search`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'post',
      mode: 'cors',
      body
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

function handleStatus (response) {
  if (response.status === 200) {
    return Promise.resolve(response)
  } else if (response.status === 409) {
    return Promise.reject(new HttpError(response.status, 'This token already exists.'))
  } else {
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

export const setEnabledStateOnToken = (tokenId, isEnabled) => {
  return (dispatch, getState) => {
    const securityToken = getState().authentication.idToken
    fetch(`${tokenServiceUrl()}/${tokenId}/state/?enabled=${isEnabled}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + securityToken
      },
      method: 'get',
      mode: 'cors'
    })
    .then(handleStatus)
    .catch(() => {
      dispatch(toggleAlertVisibility('Unable to change the state of this token!'))
      // TODO Display snackbar with an error message
    })
  }
}
