import * as Cookies from "cookies-js";
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
import { GlobalStoreState } from "src/startup/GlobalStoreState";
import { ChangePasswordResponse } from '.';
import { useConfig } from 'src/startup/config';

interface Api {
  apiLogin: (credentials: Credentials) => Promise<LoginResponse>;
  resetPassword: (resetPasswordRequest: ResetPasswordRequest) => Promise<ChangePasswordResponse>;
  changePassword: (changePasswordRequest: ChangePasswordRequest) => Promise<ChangePasswordResponse>;
  submitPasswordChangeRequest: (formData: any, formikBag: FormikBag<any, any>) => Promise<void>;
  isPasswordValid: (passwordValidationRequest: PasswordValidationRequest) => Promise<PasswordValidationResponse>;
}

export const useApi = (): Api => {
  const { httpGetJson, httpPostJsonResponse } = useHttpClient();
  const { showLoader } = useActionCreators();
  const { authenticationServiceUrl, appClientId } = useConfig();

  const apiLogin = useCallback(
    (credentials: Credentials) => {
      const { email, password } = credentials;
      const loginServiceUrl = `${authenticationServiceUrl}/authenticate`;

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
          requestingClientId: appClientId
        }),
      }, false);
    },
    [httpPostJsonResponse, showLoader]
  );

  const changePassword = useCallback(
    (changePasswordRequest: ChangePasswordRequest) => {
      const url = `${authenticationServiceUrl}/changePassword/`;
      const {
        password,
        oldPassword,
        email,
      } = changePasswordRequest;

      return httpPostJsonResponse(url, {
        body: JSON.stringify({ newPassword: password, oldPassword, email })
      }, false)
    }, []
  );

  const resetPassword = useCallback(
    (resetPasswordRequest: ResetPasswordRequest) => {
      const newPassword = resetPasswordRequest.password;
      const url = `${authenticationServiceUrl}/resetPassword/`;
      return httpPostJsonResponse(url, { body: JSON.stringify({ newPassword }) }, false);
    }, []
  );

  const submitPasswordChangeRequest = useCallback(
    (formData: any) => {
      const url = `${authenticationServiceUrl}/reset/${formData.email}`;
      return httpGetJson(url, {}, false);
    }, []
  );

  const isPasswordValid = useCallback(
    (passwordValidationRequest: PasswordValidationRequest) => {
      const url = `${authenticationServiceUrl}/isPasswordValid`;
      return httpPostJsonResponse(url, {
        body: JSON.stringify(passwordValidationRequest)
      }, false);
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
