import { Action } from "redux";

import { StoreState } from "./types";
import { User } from "../users";
import { prepareReducer, genUseActionCreators } from "../../lib/redux-actions-ts";

const CHANGE_LOGGED_IN_USER = "login/CHANGE_LOGGED_IN_USER";
const EMAIL_CHANGE = "login/EMAIL_CHANGE";
const SET_CLIENT_ID = "login/SET_CLIENT_ID";
const SET_CURRENT_USER = "login/SET_CURRENT_USER";
const SET_REDIRECT_URL = "login/SET_REDIRECT_URL";
const SET_SESSION_ID = "login/SET_SESSION_ID";
const SHOW_LOADER = "login/SHOW_LOADER";
const TOKEN_CHANGE = "login/TOKEN_CHANGE";
const TOKEN_DELETE = "login/TOKEN_DELETE";
const TOKEN_ID_CHANGE = "TOKEN_ID_CHANGE";

interface TokenIdChangeAction extends Action<"TOKEN_ID_CHANGE"> {
  idToken: string;
}
interface SetCurrentUserAction extends Action<"login/SET_CURRENT_USER"> {
  user: User;
}
interface EmailChangeAction extends Action<"login/EMAIL_CHANGE"> {
  email: String;
}
interface TokenChangeAction extends Action<"login/TOKEN_CHANGE"> {
  token: String;
}
interface TokenDeleteAction extends Action<"login/TOKEN_DELETE"> { }
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

const defaultState: StoreState = {
  idToken: "",
  token: "",
  showLoader: false,
  loggedInUserEmail: undefined
};

export const useActionCreators = genUseActionCreators({
  tokenIdChange: (idToken: string): TokenIdChangeAction => ({
    type: TOKEN_ID_CHANGE,
    idToken
  }),
  setCurrentUser: (user: User): SetCurrentUserAction => ({
    type: SET_CURRENT_USER,
    user
  }),
  changeEmail: (email: String): EmailChangeAction => ({
    type: EMAIL_CHANGE,
    email
  }),
  changeToken: (token: String): TokenChangeAction => ({
    type: TOKEN_CHANGE,
    token
  }),
  deleteToken: (): TokenDeleteAction => ({
    type: TOKEN_DELETE
  }),
  showLoader: (showLoader: boolean): ShowLoaderAction => ({
    type: SHOW_LOADER,
    showLoader
  }),
  changeLoggedInUser: (
    loggedInUserEmail: String
  ): ChangeLoggedInUserAction => ({
    type: CHANGE_LOGGED_IN_USER,
    loggedInUserEmail
  }),
  setRedirectUrl: (redirectUrl: String): SetRedirectUrlAction => ({
    type: SET_REDIRECT_URL,
    redirectUrl
  }),
  setClientId: (clientId: String): SetClientIdAction => ({
    type: SET_CLIENT_ID,
    clientId
  }),
  setSessionId: (sessionId: String): SetSessionIdAction => ({
    type: SET_SESSION_ID,
    sessionId
  })
});

export const reducer = prepareReducer(defaultState)
  .handleAction<TokenIdChangeAction>(
    TOKEN_ID_CHANGE,
    (state = defaultState, { idToken }) => ({
      ...state,
      idToken
    })
  )
  .handleAction<SetCurrentUserAction>(
    SET_CURRENT_USER,
    (state = defaultState, { user }) => ({
      ...state,
      currentUser: user
    })
  )
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
    (state = defaultState, { }) => ({
      ...state,
      token: ""
    })
  )
  .handleAction<ShowLoaderAction>(
    SHOW_LOADER,
    (state = defaultState, { showLoader }) => ({
      ...state,
      showLoader
    })
  )
  .handleAction<ChangeLoggedInUserAction>(
    CHANGE_LOGGED_IN_USER,
    (state = defaultState, { loggedInUserEmail }) => ({
      ...state,
      loggedInUserEmail
    })
  )
  .handleAction<SetRedirectUrlAction>(
    SET_REDIRECT_URL,
    (state = defaultState, { redirectUrl }) => ({
      ...state,
      redirectUrl
    })
  )
  .handleAction<SetClientIdAction>(
    SET_CLIENT_ID,
    (state = defaultState, { clientId }) => ({
      ...state,
      clientId
    })
  )
  .handleAction<SetSessionIdAction>(
    SET_SESSION_ID,
    (state = defaultState, { sessionId }) => ({
      ...state,
      sessionId
    })
  )
  .getReducer();
