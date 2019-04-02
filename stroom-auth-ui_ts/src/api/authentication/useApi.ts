import * as Cookies from "cookies-js";
import { StoreContext } from "redux-react-hook";
import { useContext, useCallback } from "react";

import useHttpClient from "../useHttpClient";
import {
  Credentials,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LoginResponse,
  PasswordValidationRequest,
  PasswordValidationResponse
} from "./types";
import { FormikBag } from "formik";
import { useActionCreators } from "./redux";
import { GlobalStoreState } from "../../startup/GlobalStoreState";
import { ChangePasswordResponse } from '.';

interface Api {
  apiLogin: (credentials: Credentials) => Promise<LoginResponse>;
  resetPassword: (resetPasswordRequest: ResetPasswordRequest) => Promise<ChangePasswordResponse>;
  changePassword: (changePasswordRequest: ChangePasswordRequest) => Promise<ChangePasswordResponse>;
  submitPasswordChangeRequest: (formData: any, formikBag: FormikBag<any, any>) => Promise<void>;
  isPasswordValid: (passwordValidationRequest: PasswordValidationRequest) => Promise<PasswordValidationResponse>;
}

export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { httpGetJson, httpPostJsonResponse } = useHttpClient();
  const { showLoader } = useActionCreators();

  if (!store) {
    throw new Error("Could not get Redux Store for processing Thunks");
  }

  const apiLogin = useCallback(
    (credentials: Credentials) => {
      const { email, password } = credentials;
      const state: GlobalStoreState = store.getState();
      const authenticationServiceUrl =
        state.config.values.authenticationServiceUrl;
      const loginServiceUrl = `${authenticationServiceUrl}/authenticate`;
      const clientId = state.config.values.appClientId;

      // We need to post the sessionId in the credentials, otherwise the
      // authenticationService will have no way of marking the session as valid.
      const fullSessionId = Cookies.get("authSessionId");
      let sessionId = fullSessionId;
      if (fullSessionId.indexOf(".") > -1) {
        sessionId = fullSessionId.slice(0, fullSessionId.indexOf("."));
      }

      return httpPostJsonResponse(loginServiceUrl, {
        body: JSON.stringify({
          email,
          password,
          sessionId,
          requestingClientId: clientId
        })
      });
    },
    [httpPostJsonResponse, showLoader]
  );

  const changePassword = useCallback(
    (changePasswordRequest: ChangePasswordRequest) => {
      const state: GlobalStoreState = store.getState();
      const url = `${state.config.values.authenticationServiceUrl}/changePassword/`;
      const {
        password,
        oldPassword,
        email,
      } = changePasswordRequest;

      return httpPostJsonResponse(url, {
        body: JSON.stringify({ newPassword: password, oldPassword, email })
      })
    }, []
  );

  const resetPassword = useCallback(
    (resetPasswordRequest: ResetPasswordRequest) => {
      const state: GlobalStoreState = store.getState();
      const newPassword = resetPasswordRequest.password;
      const url = `${state.config.values.authenticationServiceUrl}/resetPassword/`;
      return httpPostJsonResponse(url, { body: JSON.stringify({ newPassword }) });
    }, []
  );

  const submitPasswordChangeRequest = useCallback(
    (formData: any) => {
      const state: GlobalStoreState = store.getState();
      const url = `${state.config.values.authenticationServiceUrl}/reset/${formData.email}`;
      return httpGetJson(url, {});
    }, []
  );

  const isPasswordValid = useCallback(
    (passwordValidationRequest: PasswordValidationRequest) => {
      const state: GlobalStoreState = store.getState();
      const url = `${
        state.config.values.authenticationServiceUrl
        }/isPasswordValid`;
      return httpPostJsonResponse(url, {
        body: JSON.stringify(passwordValidationRequest)
      });
    }, []
  );

  return {
    apiLogin,
    submitPasswordChangeRequest,
    resetPassword,
    changePassword,
    isPasswordValid
  };
};

export default useApi;
