import { Action } from "redux";
import { StoreState, Token } from "./types";
import {
  genUseActionCreators,
  prepareReducer
} from "../..//lib/redux-actions-ts";
import { any } from "prop-types";

const CHANGE_VISIBLE_CONTAINER = "token/CHANGE_VISIBLE_CONTAINER";
const UPDATE_MATCHING_AUTO_COMPLETE_RESULTS =
  "token/UPDATE_MATCHING_AUTO_COMPLETE_RESULTS";
const CHANGE_READ_CREATED_TOKEN = "token/CHANGE_READ_CREATED_TOKEN";
const SHOW_ERROR_MESSAGE = "token/SHOW_ERROR_MESSAGE";
const HIDE_ERROR_MESSAGE = "token/HIDE_ERROR_MESSAGE";
const TOGGLE_STATE = "token/TOGGLE_STATE";
const TOGGLE_IS_CREATING = "token/TOGGLE_IS_CREATING";

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

// export default (state = initialState, action) => {
//   switch (action.type) {
//     case CHANGE_VISIBLE_CONTAINER:
//       return {
//         ...state,
//         show: action.show,
//       };

//     case UPDATE_MATCHING_AUTO_COMPLETE_RESULTS:
//       return {
//         ...state,
//         matchingAutoCompleteResults: action.matchingAutoCompleteResults,
//       };

//     case CHANGE_READ_CREATED_TOKEN:
//       return {
//         ...state,
//         lastReadToken: action.lastReadToken,
//       };

//     case SHOW_ERROR_MESSAGE:
//       return {
//         ...state,
//         errorMessage: action.message,
//       };

//     case HIDE_ERROR_MESSAGE:
//       return {
//         ...state,
//         errorMessage: '',
//       };
//     case TOGGLE_STATE:
//       return {
//         ...state,
//         lastReadToken: {
//           ...state.lastReadToken,
//           enabled: !state.lastReadToken.enabled,
//         },
//       };
//     case TOGGLE_IS_CREATING:
//       return {
//         ...state,
//         isCreating: !state.isCreating,
//       };
//     default:
//       return state;
//   }
// };

// export function changeVisibleContainer(container) {
//   return {
//     type: CHANGE_VISIBLE_CONTAINER,
//     show: container,
//   };
// }

// function showCreateError(message) {
//   return {
//     type: SHOW_ERROR_MESSAGE,
//     message,
//   };
// }

// function hideCreateError() {
//   return {
//     type: HIDE_ERROR_MESSAGE,
//   };
// }

// function toggleState() {
//   return {
//     type: TOGGLE_STATE,
//   };
// }

// function toggleIsCreating() {
//   return {
//     type: TOGGLE_IS_CREATING,
//   };
// }
// const SHOW_SEARCH_LOADER = "userSearch/SHOW_SEARCH_LOADER";
// const UPDATE_RESULTS = "userSearch/UPDATE_RESULTS";
// const SELECT_ROW = "userSearch/SELECT_ROW";

// interface ShowSearchLoaderAction extends Action< "userSearch/SHOW_SEARCH_LOADER">{
//    showSearchLoader: boolean;
// }
// interface UpdateResultsAction extends Action< "userSearch/UPDATE_RESULTS">{
//    results: User[];
// }
// interface SelectRowAction extends Action< "userSearch/SELECT_ROW">{
//    selectedUserRowId: String;
// }

// const defaultState: StoreState = {
//   users: [],
//   showSearchLoader: false,
//   selectedUserRowId: undefined
// }
// // const initialState = {
// //   users: [],
// //   showSearchLoader: false,
// //   selectedUserRowId: undefined
// // };

// export const useActionCreators = genUseActionCreators({
//     showSearchLoader: (showSearchLoader:boolean): ShowSearchLoaderAction => ({
//         type: SHOW_SEARCH_LOADER,
//         showSearchLoader
//     }),
//     updateResults: (results:User[]): UpdateResultsAction => ({
//         type: UPDATE_RESULTS,
//         results
//     }),
//     selectRow: (selectedUserRowId: String): SelectRowAction => ({
//         type: SELECT_ROW,
//         selectedUserRowId
//     })
// });

// export const reducer = prepareReducer(defaultState)
//     .handleAction<ShowSearchLoaderAction>(
//         SHOW_SEARCH_LOADER,
//         (state = defaultState, {showSearchLoader}) => ({
//             ...state,
//             showSearchLoader
//         })
//     )
//     .handleAction<UpdateResultsAction>(
//         UPDATE_RESULTS,
//         (state = defaultState, {results}) => ({
//             ...state,
//             results
//         })
//     )
//     .handleAction<SelectRowAction>(
//         SELECT_ROW,
//         (state = defaultState, {selectedUserRowId}) => {
//           if (state.selectedUserRowId === selectedUserRowId) {
//             return({
//                 ...state,
//                 selectedUserRowId: undefined
//             })
//         } else {
//            return ({
//                ...state,
//                selectedUserRowId
//            })
//         }
//     });
