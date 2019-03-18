import { Action } from "redux";
import { StoreState } from "./types";
import { genUseActionCreators, prepareReducer } from "src/lib/redux-actions-ts";
import { User } from "../users/types";

const SHOW_SEARCH_LOADER = "userSearch/SHOW_SEARCH_LOADER";
const UPDATE_RESULTS = "userSearch/UPDATE_RESULTS";
const SELECT_ROW = "userSearch/SELECT_ROW";

interface ShowSearchLoaderAction
  extends Action<"userSearch/SHOW_SEARCH_LOADER"> {
  showSearchLoader: boolean;
}
interface UpdateResultsAction extends Action<"userSearch/UPDATE_RESULTS"> {
  results: User[];
}
interface SelectRowAction extends Action<"userSearch/SELECT_ROW"> {
  selectedUserRowId: string;
}

const defaultState: StoreState = {
  users: [],
  showSearchLoader: false,
  selectedUserRowId: undefined,
  results: []
};
// const initialState = {
//   users: [],
//   showSearchLoader: false,
//   selectedUserRowId: undefined
// };

export const useActionCreators = genUseActionCreators({
  showSearchLoader: (showSearchLoader: boolean): ShowSearchLoaderAction => ({
    type: SHOW_SEARCH_LOADER,
    showSearchLoader
  }),
  updateResults: (results: User[]): UpdateResultsAction => ({
    type: UPDATE_RESULTS,
    results
  }),
  selectRow: (selectedUserRowId: string): SelectRowAction => ({
    type: SELECT_ROW,
    selectedUserRowId
  })
});

export const reducer = prepareReducer(defaultState)
  .handleAction<ShowSearchLoaderAction>(
    SHOW_SEARCH_LOADER,
    (state = defaultState, { showSearchLoader }) => ({
      ...state,
      showSearchLoader
    })
  )
  .handleAction<UpdateResultsAction>(
    UPDATE_RESULTS,
    (state = defaultState, { results }) => ({
      ...state,
      results
    })
  )
  .handleAction<SelectRowAction>(
    SELECT_ROW,
    (state = defaultState, { selectedUserRowId }) => {
      if (state.selectedUserRowId === selectedUserRowId) {
        return {
          ...state,
          selectedUserRowId: undefined
        };
      } else {
        return {
          ...state,
          selectedUserRowId
        };
      }
    }
  );

// export default (state = initialState, action) => {
//   switch (action.type) {
//     case SHOW_SEARCH_LOADER:
//       return {
//         ...state,
//         showSearchLoader: action.showSearchLoader
//       };
//     case UPDATE_RESULTS:
//       return {
//         ...state,
//         results: action.results
//       };
//     case SELECT_ROW:
//       if (state.selectedUserRowId === action.selectedUserRowId) {
//         return {
//           ...state,
//           selectedUserRowId: undefined
//         };
//       } else {
//         return {
//           ...state,
//           selectedUserRowId: action.selectedUserRowId
//         };
//       }
//     default:
//       return state;
//   }
// };

// export function showSearchLoader(showSearchLoader) {
//   return {
//     type: SHOW_SEARCH_LOADER,
//     showSearchLoader
//   };
// }

// export function updateResults(results) {
//   return {
//     type: UPDATE_RESULTS,
//     results
//   };
// }

// export const changeSelectedRow = userId => {
//   return dispatch => {
//     dispatch({
//       type: SELECT_ROW,
//       selectedUserRowId: userId
//     });
//   };
// };
