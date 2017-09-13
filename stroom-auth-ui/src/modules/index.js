import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import login from './login'
import user from './user'
import userSearch from './userSearch'
import token from './token'
import tokenSearch from './tokenSearch'

export default combineReducers({
  routing: routerReducer,
  login,
  user,
  userSearch,
  token,
  tokenSearch,
  form: formReducer
})