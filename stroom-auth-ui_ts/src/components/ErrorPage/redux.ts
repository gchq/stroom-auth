/*
 * Copyright 2018 Crown Copyright
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
import {
  genUseActionCreators,
  prepareReducer
} from "../../lib/redux-actions-ts";
import { StoreState } from "./types";

const initialState = {
  errorMessage: "",
  stackTrace: "",
  httpErrorCode: 0
};

const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
interface SetErrorMessageAction extends Action<"SET_ERROR_MESSAGE"> {
  errorMessage: string;
}

const SET_STACK_TRACE = "SET_STACK_TRACE";
interface SetStackTraceAction extends Action<"SET_STACK_TRACE"> {
  stackTrace: string;
}

const SET_HTTP_ERROR_CODE = "SET_HTTP_ERROR_CODE";
interface SetHttpErrorCodeAction extends Action<"SET_HTTP_ERROR_CODE"> {
  httpErrorCode: number;
}

export const useActionCreators = genUseActionCreators({
  setErrorMessage: (errorMessage: string): SetErrorMessageAction => ({
    type: SET_ERROR_MESSAGE,
    errorMessage
  }),
  setStackTrace: (stackTrace: string): SetStackTraceAction => ({
    type: SET_STACK_TRACE,
    stackTrace
  }),
  setHttpErrorCode: (httpErrorCode: number): SetHttpErrorCodeAction => ({
    type: SET_HTTP_ERROR_CODE,
    httpErrorCode
  })
});

export const reducer = prepareReducer<StoreState>(initialState)
  .handleAction<SetErrorMessageAction>(
    SET_ERROR_MESSAGE,
    (state: StoreState, { errorMessage }) => ({
      ...state,
      errorMessage
    })
  )
  .handleAction<SetStackTraceAction>(
    SET_STACK_TRACE,
    (state: StoreState, { stackTrace }) => ({
      ...state,
      stackTrace
    })
  )
  .handleAction<SetHttpErrorCodeAction>(
    SET_HTTP_ERROR_CODE,
    (state: StoreState, { httpErrorCode }) => ({
      ...state,
      httpErrorCode
    })
  )
  .getReducer();
