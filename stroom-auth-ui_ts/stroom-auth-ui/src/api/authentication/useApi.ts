import * as Cookies from 'cookies-js';
import { StoreContext } from "redux-react-hook";
import { useContext, useCallback } from "react";

import useHttpClient from "../useHttpClient";
import { Credentials } from "./types";
import { FormikBag } from "formik";
import { useActionCreators } from "./redux";
import { GlobalStoreState } from '../..//modules';

interface Api {
  // FIXME: Not sure if the FormikBag types are correct
  login: (credentials: Credentials, formikBag: FormikBag<any, any>) => void;
}

export const useApi = (): Api => {
  const store = useContext(StoreContext);
  const { httpPostJsonResponse } = useHttpClient();
  const { showLoader } = useActionCreators();

  if (!store) {
    throw new Error("Could not get Redux Store for processing Thunks");
  }

  const login = useCallback(
    (credentials: Credentials, { setStatus, setSubmitting }) => {
      const { email, password } = credentials;
      const state:GlobalStoreState = store.getState();
      // We want to show a preloader while we're making the request. We turn it off when we receive a response or catch an error.
      showLoader(true);

      const authenticationServiceUrl = state.config.values.authenticationServiceUrl;
      const loginServiceUrl = `${authenticationServiceUrl}/authenticate`;
      const clientId = state.config.values.appClientId;
      // const stroomUiUrl = state.config.values.stroomUiUrl;

      // We need to post the sessionId in the credentials, otherwise the
      // authenticationService will have no way of marking the session as valid.
      const fullSessionId = Cookies.get("authSessionId");
      let sessionId = fullSessionId;
      if (fullSessionId.indexOf(".") > -1) {
        sessionId = fullSessionId.slice(0, fullSessionId.indexOf("."));
      }
      httpPostJsonResponse(loginServiceUrl, {
        body: JSON.stringify({
          email,
          password,
          sessionId,
          requestingClientId: clientId
        })
      }).then(response => {
        // We'll check for a 422, which we know might indicate there's no session
        // if (response.status === 422) {
        //   setStatus(
        //     "There is no session on the authentication service! This might be caused " +
        //       "by incorrectly configured service URLs."
        //   );
        //   window.location.href = stroomUiUrl;
        // } else {
        //   response
        //     .then(
        //       (loginResponse: {
        //         loginSuccessful: any;
        //         redirectUrl: string;
        //         message: any;
        //       }) => {
                if (response.loginSuccessful) {
                  // Otherwise we'll extract what we expect to be the successful login redirect URL
                  Cookies.set("username", email);
                  window.location.href = response.redirectUrl;
                } else {
                  setStatus(response.message);
                  setSubmitting(false);
                }
                return;
              // }
            // );
        // }
      });
    },
    [httpPostJsonResponse, showLoader]
  );

  return {
    login
  };
};

export default useApi;
