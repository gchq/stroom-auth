import { Action } from "redux";
import { StoreState, Token } from "./types";
import {
  genUseActionCreators,
  prepareReducer
} from "../..//lib/redux-actions-ts";

const CHANGE_READ_CREATED_TOKEN = "token/CHANGE_READ_CREATED_TOKEN";
const CHANGE_VISIBLE_CONTAINER = "token/CHANGE_VISIBLE_CONTAINER";
const HIDE_ERROR_MESSAGE = "token/HIDE_ERROR_MESSAGE";
const SHOW_ERROR_MESSAGE = "token/SHOW_ERROR_MESSAGE";
const TOGGLE_IS_CREATING = "token/TOGGLE_IS_CREATING";
const TOGGLE_STATE = "token/TOGGLE_STATE";
const UPDATE_MATCHING_AUTO_COMPLETE_RESULTS = "token/UPDATE_MATCHING_AUTO_COMPLETE_RESULTS";

interface ChangeVisibleContainerAction
  extends Action<"token/CHANGE_VISIBLE_CONTAINER"> {
  show: string;
}
interface UpdateMatchingAutoCompleteResultsAction
  extends Action<"token/UPDATE_MATCHING_AUTO_COMPLETE_RESULTS"> {
  matchingAutoCompleteResults: string[];
}
interface ChangeReadCreatedTokenAction
  extends Action<"token/CHANGE_READ_CREATED_TOKEN"> {
  lastReadToken: Token;
}
interface ShowErrorMessageAction extends Action<"token/SHOW_ERROR_MESSAGE"> {
  errorMessage: string;
}
interface HideErrorMessageAction extends Action<"token/HIDE_ERROR_MESSAGE"> {}
interface ToggleStateAction extends Action<"token/TOGGLE_STATE"> {}
interface ToggleIsCreatingAction extends Action<"token/TOGGLE_IS_CREATING"> {}

const defaultState: StoreState = {
  lastReadToken: undefined,
  matchingAutoCompleteResults: [],
  errorMessage: "",
  isCreating: false,
  show: ""
};

export const useActionCreators = genUseActionCreators({
  changeVisibleContainer: (show: string): ChangeVisibleContainerAction => ({
    type: CHANGE_VISIBLE_CONTAINER,
    show
  }),
  updateMatchingAutoCompleteResults: (
    matchingAutoCompleteResults: string[]
  ): UpdateMatchingAutoCompleteResultsAction => ({
    type: UPDATE_MATCHING_AUTO_COMPLETE_RESULTS,
    matchingAutoCompleteResults
  }),
  changeReadCreatedToken: (
    lastReadToken: Token
  ): ChangeReadCreatedTokenAction => ({
    type: CHANGE_READ_CREATED_TOKEN,
    lastReadToken
  }),
  showErrorMessage: (errorMessage: string): ShowErrorMessageAction => ({
    type: SHOW_ERROR_MESSAGE,
    errorMessage
  }),
  hideErrorMessage: (): HideErrorMessageAction => ({
    type: HIDE_ERROR_MESSAGE
  }),
  toggleState: (): ToggleStateAction => ({
    type: TOGGLE_STATE
  }),
  toggleIsCreating: (): ToggleIsCreatingAction => ({
    type: TOGGLE_IS_CREATING
  })
});

export const reducer = prepareReducer(defaultState)
  .handleAction<ChangeVisibleContainerAction>(
    CHANGE_VISIBLE_CONTAINER,
    (state = defaultState, { show }) => ({
      ...state,
      show
    })
  )
  .handleAction<UpdateMatchingAutoCompleteResultsAction>(
    UPDATE_MATCHING_AUTO_COMPLETE_RESULTS,
    (state = defaultState, { matchingAutoCompleteResults }) => ({
      ...state,
      matchingAutoCompleteResults
    })
  )
  .handleAction<ChangeReadCreatedTokenAction>(
    CHANGE_READ_CREATED_TOKEN,
    (state = defaultState, { lastReadToken }) => ({
      ...state,
      lastReadToken
    })
  )
  .handleAction<ShowErrorMessageAction>(
    SHOW_ERROR_MESSAGE,
    (state = defaultState, { errorMessage }) => ({
      ...state,
      errorMessage
    })
  )
  .handleAction<HideErrorMessageAction>(
    HIDE_ERROR_MESSAGE,
    (state = defaultState, {}) => ({
      ...state,
      errorMessage: ""
    })
  )
  .handleAction<ToggleStateAction>(
    TOGGLE_STATE,
    (state = defaultState, {}) => ({
      ...state,
      lastReadToken: {
        ...state.lastReadToken,
        enabled: !state.lastReadToken.enabled
      }
    })
  )
  .handleAction<ToggleIsCreatingAction>(
    TOGGLE_IS_CREATING,
    (state = defaultState, {}) => ({
      ...state,
      isCreating: !state.isCreating
    })
  )
  .getReducer();
