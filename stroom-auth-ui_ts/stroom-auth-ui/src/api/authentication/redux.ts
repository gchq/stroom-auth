import { Action } from "redux";

import {
  prepareReducer,
  genUseActionCreators
} from "../../lib/redux-actions-ts";
// import {
//   ElementDefinitions,
//   ElementPropertiesByElementIdType
// } from "../types";
import { StoreState } from "./types";

const EMAIL_CHANGE = 'login/EMAIL_CHANGE';
// const PASSWORD_CHANGE = 'login/PASSWORD_CHANGE'; // Not USED!
const TOKEN_CHANGE = 'login/TOKEN_CHANGE';
const TOKEN_DELETE = 'login/TOKEN_DELETE';
const SHOW_LOADER = 'login/SHOW_LOADER';
const CHANGE_LOGGED_IN_USER = 'login/CHANGE_LOGGED_IN_USER';
const SET_REDIRECT_URL = 'login/SET_REDIRECT_URL';
const SET_CLIENT_ID = 'login/SET_CLIENT_ID';
const SET_SESSION_ID = 'login/SET_SESSION_ID';

//  const ELEMENTS_RECEIVED = "ELEMENTS_RECEIVED";
//  const ELEMENT_PROPERTIES_RECEIVED = "ELEMENT_PROPERTIES_RECEIVED";
interface EmailChangeAction extends Action<"login/EMAIL_CHANGE"> {
    email: String;
}

interface TokenChangeAction extends Action<"login/TOKEN_CHANGE"> {
    token: String;
}

interface TokenDeleteAction extends Action<"login/TOKEN_DELETE"> {
}

interface ShowLoaderAction extends Action<"login/SHOW_LOADER"> {
    showLoader: boolean;
}

interface ChangeLoggedInUserAction extends Action<"login/CHANGE_LOGGED_IN_USER"> {
    loggedInUserEmail: String;
}

interface SetRedirectUrlAction extends Action<"login/SET_REDIRECT_URL"> {
    redirectUrl: String;
}

interface SetClientIdAction extends Action<"login/SET_CLIENT_ID"> {
    clientId: String;
}

interface SetSessionIdAction extends Action<"login/SET_SESSION_ID"> {
    sessionId: String;
}

//  interface ElementsReceivedAction extends Action<"ELEMENTS_RECEIVED"> {
//   elementDefinitions: ElementDefinitions;
// }
// 
//  interface ElementPropertiesReceivedAction
//   extends Action<"ELEMENT_PROPERTIES_RECEIVED"> {
//   elementProperties: ElementPropertiesByElementIdType;
// }



 const defaultState: StoreState = {
  token: "",
  showLoader: false,
  loggedInUserEmail: undefined
};

export const useActionCreators = genUseActionCreators({
  changeEmail: (
    email: String
  ): EmailChangeAction => ({
    type: EMAIL_CHANGE,
    email
  }),
  changeToken: (
    token: String
  ): TokenChangeAction => ({
    type: TOKEN_CHANGE,
    token
  }),
  deleteToken: (): TokenDeleteAction => ({
      type: TOKEN_DELETE,
  }),
  showLoader: (
      showLoader: boolean
  ): ShowLoaderAction => ({
      type: SHOW_LOADER,
      showLoader
  }),
  changeLoggedInUser: (
      loggedInUserEmail:String,
  ): ChangeLoggedInUserAction => ({
      type: CHANGE_LOGGED_IN_USER,
      loggedInUserEmail
  }),
  setRedirectUrl: (
      redirectUrl: String,
  ): SetRedirectUrlAction => ({
      type: SET_REDIRECT_URL,
      redirectUrl
  }),
  setClientId: (
      clientId: String
  ): SetClientIdAction => ({
      type: SET_CLIENT_ID,
      clientId
  }),
  setSessionId: (
      sessionId: String,
  ): SetSessionIdAction => ({
      type:SET_SESSION_ID,
      sessionId
  })
});

export const reducer = prepareReducer(defaultState)
  .handleAction<EmailChangeAction>(
    EMAIL_CHANGE,
    (state = defaultState, { email }) => ({
      ...state,
      email
    })
  )
  .handleAction<TokenChangeAction>(
    TOKEN_CHANGE,
    (state = defaultState, { token }) => ({
      ...state,
      token
    })
  )
  .handleAction<TokenDeleteAction>(
      TOKEN_DELETE,
      (state = defaultState, {}) => ({
          ...state,
          token: ''
      })
  )
  .handleAction<ShowLoaderAction>(
      SHOW_LOADER,
      (state = defaultState, {showLoader}) => ({
          ...state,
          showLoader
      })
  )
  .handleAction<ChangeLoggedInUserAction>(
    CHANGE_LOGGED_IN_USER,
    (state = defaultState, {loggedInUserEmail}) => ({
        ...state,
        loggedInUserEmail
    })      
  )
   .handleAction<SetRedirectUrlAction>(
       SET_REDIRECT_URL,
       (state = defaultState, {redirectUrl}) => ({
           ...state,
           redirectUrl
       })
   )
   .handleAction<SetClientIdAction>(
       SET_CLIENT_ID,
       (state = defaultState, {clientId}) => ({
           ...state,
           clientId
       })
   )
   .handleAction<SetSessionIdAction>(
       SET_SESSION_ID,
       (state = defaultState, {sessionId}) => ({
           ...state,
           sessionId
       })
   )
  .getReducer();
