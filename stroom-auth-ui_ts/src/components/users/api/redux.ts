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

import { Action } from "redux";
import { StoreState } from "../types";
import {
  genUseActionCreators,
  prepareReducer
} from "../../../lib/redux-actions-ts";

const CLEAR_USER_BEING_EDITED = "user/CLEAR_USER_BEING_EDITED";
const HIDE_CHANGE_PASSWORD_ERROR_MESSAGE =
  "user/HIDE_CHANGE_PASSWORD_ERROR_MESSAGE";
const SHOW_CHANGE_PASSWORD_ERROR_MESSAGE =
  "user/SHOW_CHANGE_PASSWORD_ERROR_MESSAGE";
const SHOW_CREATE_LOADER = "user/SHOW_CREATE_LOADER";
const TOGGLE_ALERT_VISIBILITY = "user/TOGGLE_ALERT_VISIBILITY";
const TOGGLE_IS_SAVING = "user/TOGGLE_IS_SAVING";

interface ShowCreateLoaderAction extends Action<"user/SHOW_CREATE_LOADER"> {
  showCreateLoader: boolean;
}
interface ToggleAlertVisibilityAction
  extends Action<"user/TOGGLE_ALERT_VISIBILITY"> {
  showAlert: boolean;
  alertText: string;
}
interface ShowChangePasswordErrorMessageAction
  extends Action<"user/SHOW_CHANGE_PASSWORD_ERROR_MESSAGE"> {
  changePasswordErrorMessage: string[];
}
interface HideChangePasswordErrorMessageAction
  extends Action<"user/HIDE_CHANGE_PASSWORD_ERROR_MESSAGE"> {}
interface ClearUserBeingEditedAction
  extends Action<"user/CLEAR_USER_BEING_EDITED"> {}
interface ToggleIsSavingAction extends Action<"user/TOGGLE_IS_SAVING"> {
  isSaving: boolean;
}

const defaultState: StoreState = {
  user: "",
  password: "",
  showCreateLoader: false,
  alertText: "",
  showAlert: false,
  changePasswordErrorMessage: [],
  isSaving: false,
  errorStatus: undefined,
  errorText: undefined
};

export const useActionCreators = genUseActionCreators({
  showCreateLoader: (showCreateLoader: boolean): ShowCreateLoaderAction => ({
    type: SHOW_CREATE_LOADER,
    showCreateLoader
  }),
  toggleAlertVisibility: (
    showAlert: boolean,
    alertText: string
  ): ToggleAlertVisibilityAction => ({
    type: TOGGLE_ALERT_VISIBILITY,
    alertText,
    showAlert
  }),
  showChangePasswordErrorMessage: (
    changePasswordErrorMessage: string[]
  ): ShowChangePasswordErrorMessageAction => ({
    type: SHOW_CHANGE_PASSWORD_ERROR_MESSAGE,
    changePasswordErrorMessage
  }),
  hideChangePasswordErrorMessage: (): HideChangePasswordErrorMessageAction => ({
    type: HIDE_CHANGE_PASSWORD_ERROR_MESSAGE
  }),
  clearUserBeingEdited: (): ClearUserBeingEditedAction => ({
    type: CLEAR_USER_BEING_EDITED
  }),
  toggleIsSaving: (isSaving: boolean): ToggleIsSavingAction => ({
    type: TOGGLE_IS_SAVING,
    isSaving
  })
});

export const reducer = prepareReducer(defaultState)
  .handleAction<ShowCreateLoaderAction>(
    SHOW_CREATE_LOADER,
    (state = defaultState, { showCreateLoader }) => ({
      ...state,
      showCreateLoader
    })
  )
  .handleAction<ToggleAlertVisibilityAction>(
    TOGGLE_ALERT_VISIBILITY,
    (state = defaultState, { showAlert, alertText }) => ({
      ...state,
      showAlert,
      alertText
    })
  )
  .handleAction<ShowChangePasswordErrorMessageAction>(
    SHOW_CHANGE_PASSWORD_ERROR_MESSAGE,
    (state = defaultState, { changePasswordErrorMessage }) => ({
      ...state,
      changePasswordErrorMessage
    })
  )
  .handleAction<HideChangePasswordErrorMessageAction>(
    HIDE_CHANGE_PASSWORD_ERROR_MESSAGE,
    (state = defaultState, {}) => ({
      ...state,
      changePasswordErrorMessage: []
    })
  )
  .handleAction<ClearUserBeingEditedAction>(
    CLEAR_USER_BEING_EDITED,
    (state = defaultState, {}) => ({
      ...state,
      userBeingEdited: undefined
    })
  )
  .handleAction<ToggleIsSavingAction>(
    TOGGLE_ALERT_VISIBILITY,
    (state = defaultState, { isSaving }) => ({
      ...state,
      isSaving
    })
  )
  .getReducer();
