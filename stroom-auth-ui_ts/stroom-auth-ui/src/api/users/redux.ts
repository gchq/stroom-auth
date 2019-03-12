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
import {Action} from "redux";
import { StoreState } from "./types";
import { genUseActionCreators, prepareReducer } from 'src/lib/redux-actions-ts';

// const CREATE_REQUEST = 'user/CREATE_REQUEST';
// const CREATE_RESPONSE = 'user/CREATE_RESPONSE';
const SHOW_CREATE_LOADER = 'user/SHOW_CREATE_LOADER';
const SAVE_USER_BEING_EDITED = 'user/SAVE_USER_BEING_EDITED';
const CHANGE_VISIBLE_CONTAINER = 'user/CHANGE_VISIBLE_CONTAINER';
const TOGGLE_ALERT_VISIBILITY = 'user/TOGGLE_ALERT_VISIBILITY';
const SHOW_CHANGE_PASSWORD_ERROR_MESSAGE = 'user/SHOW_CHANGE_PASSWORD_ERROR_MESSAGE';
const HIDE_CHANGE_PASSWORD_ERROR_MESSAGE = 'user/HIDE_CHANGE_PASSWORD_ERROR_MESSAGE';
const CLEAR_USER_BEING_EDITED = 'user/CLEAR_USER_BEING_EDITED';
const TOGGLE_IS_SAVING = 'user/TOGGLE_IS_SAVING';

// interface createRequestAction extends Action<'user/CREATE_REQUEST'> {
  
// }
// interface createResponseAction extends Action<'user/CREATE_RESPONSE'> {
  
// }
interface ShowCreateLoaderAction extends Action<'user/SHOW_CREATE_LOADER'> {
  showCreateLoader: boolean;
}
interface SaveUserBeingEditedAction extends Action<'user/SAVE_USER_BEING_EDITED'> {
  userBeingEdited: String | undefined; 
}
interface ChangeVisibleContainerAction extends Action<'user/CHANGE_VISIBLE_CONTAINER'> {
  show: boolean;  
}
interface ToggleAlertVisibilityAction extends Action<'user/TOGGLE_ALERT_VISIBILITY'> {
  showAlert: boolean;
  alertText: String; 
}
interface ShowChangePasswordErrorMessageAction extends Action<'user/SHOW_CHANGE_PASSWORD_ERROR_MESSAGE'> {
  changePasswordErrorMessage: String[]; 
}
interface HideChangePasswordErrorMessageAction extends Action<'user/HIDE_CHANGE_PASSWORD_ERROR_MESSAGE'> {
  
}
interface ClearUserBeingEditedAction extends Action<'user/CLEAR_USER_BEING_EDITED'> {
  
}
interface ToggleIsSavingAction extends Action<'user/TOGGLE_IS_SAVING'> {
  isSaving: boolean;
}

const defaultState: StoreState ={
  user: '',
  password: '',
  showCreateLoader: false,
  alertText: '',
  showAlert: false,
  changePasswordErrorMessage: [],
  isSaving: false,
}

export const useActionCreators = genUseActionCreators({
  showCreateLoader: (
    showCreateLoader: boolean
  ): ShowCreateLoaderAction => ({
    type: SHOW_CREATE_LOADER,
    showCreateLoader
  }),
  saveUserBeingEdited: (
    userBeingEdited: String | undefined
  ): SaveUserBeingEditedAction => ({
    type: SAVE_USER_BEING_EDITED,
    userBeingEdited
  }),
  changeVisibleContainer: (
    show: boolean
  ): ChangeVisibleContainerAction => ({
    type: CHANGE_VISIBLE_CONTAINER,
    show
  }),
  toggleAlertVisibility: (
    showAlert: boolean,
    alertText: String
  ): ToggleAlertVisibilityAction => ({
    type: TOGGLE_ALERT_VISIBILITY,
    alertText,
    showAlert
  }),
  showChangePasswordErrorMessage: (
    changePasswordErrorMessage: String[]
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
  toggleIsSaving: (
    isSaving: boolean
  ): ToggleIsSavingAction => ({
    type: TOGGLE_IS_SAVING,
    isSaving
  })
});

export const reducer = prepareReducer(defaultState)
  .handleAction<ShowCreateLoaderAction>(
    SHOW_CREATE_LOADER,
    (state = defaultState, {showCreateLoader}) => ({
      ...state,
      showCreateLoader
    })
  )
  .handleAction<SaveUserBeingEditedAction>(
    SAVE_USER_BEING_EDITED,
    (state = defaultState, {userBeingEdited}) => ({
      ...state,
      userBeingEdited
    })
  )
  .handleAction<ChangeVisibleContainerAction>(
    CHANGE_VISIBLE_CONTAINER,
    (state = defaultState, {show}) => ({
      ...state,
      show
    })
  )
  .handleAction<ToggleAlertVisibilityAction>(
    TOGGLE_ALERT_VISIBILITY,
    (state = defaultState, {showAlert, alertText}) => ({
      ...state,
      showAlert,
      alertText
    })
  )
  .handleAction<ShowChangePasswordErrorMessageAction>(
    SHOW_CHANGE_PASSWORD_ERROR_MESSAGE,
    (state = defaultState, {changePasswordErrorMessage}) => ({
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
    (state = defaultState, {isSaving}) => ({
      ...state,
      isSaving
    })
  )
  .getReducer();
// const initialState = {
//   user: '',
//   password: '',
//   showCreateLoader: false,
//   alertText: '',
//   showAlert: false,
//   changePasswordErrorMessage: [],
//   isSaving: false,
// };

// export default (state = initialState, action) => {
//   switch (action.type) {
//     case CREATE_REQUEST:
//       return {
//         ...state,
//         // TODO mark something as 'creating'
//       };
//     case CREATE_RESPONSE:
//       return {
//         ...state,
//         // TODO change creating to 'created' or something similar
//       };
//     case SHOW_CREATE_LOADER:
//       return {
//         ...state,
//         showCreateLoader: action.showCreateLoader,
//       };

//     case SAVE_USER_BEING_EDITED:
//       return {
//         ...state,
//         userBeingEdited: action.user,
//       };

//     case CLEAR_USER_BEING_EDITED:
//       return {
//         ...state,
//         userBeingEdited: undefined,
//       };

//     case CHANGE_VISIBLE_CONTAINER:
//       return {
//         ...state,
//         show: action.show,
//       };

//     case TOGGLE_ALERT_VISIBILITY:
//       const showAlert = !state.showAlert;
//       return {
//         ...state,
//         showAlert: showAlert,
//         alertText: action.alertText,
//       };

//     case SHOW_CHANGE_PASSWORD_ERROR_MESSAGE:
//       return {
//         ...state,
//         changePasswordErrorMessage: action.message,
//       };

//     case HIDE_CHANGE_PASSWORD_ERROR_MESSAGE:
//       return {
//         ...state,
//         changePasswordErrorMessage: [],
//       };

//     case TOGGLE_IS_SAVING:
//       return {
//         ...state,
//         isSaving: !state.isSaving,
//       };

//     default:
//       return state;
//   }
// };

// export function showCreateLoader(showCreateLoader) {
//   return {
//     type: SHOW_CREATE_LOADER,
//     showCreateLoader,
//   };
// }

// export function changeVisibleContainer(container) {
//   return {
//     type: CHANGE_VISIBLE_CONTAINER,
//     show: container,
//   };
// }

// export function toggleAlertVisibility(alertText) {
//   return {
//     type: TOGGLE_ALERT_VISIBILITY,
//     alertText: alertText,
//   };
// }

// function showChangePasswordErrorMessage(message) {
//   return {
//     type: SHOW_CHANGE_PASSWORD_ERROR_MESSAGE,
//     message,
//   };
// }

// function hideChangePasswordErrorMessage() {
//   return {
//     type: HIDE_CHANGE_PASSWORD_ERROR_MESSAGE,
//   };
// }

// function saveUserBeingEdited(user) {
//   return {
//     type: SAVE_USER_BEING_EDITED,
//     user,
//   };
// }

// function toggleIsSaving() {
//   return {type: TOGGLE_IS_SAVING};
// }

// export function clearUserBeingEdited() {
//   return {
//     type: CLEAR_USER_BEING_EDITED,
//   };
// }
