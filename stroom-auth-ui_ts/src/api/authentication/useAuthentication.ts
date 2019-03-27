import * as Cookies from "cookies-js";
import { FormikActions } from "formik";
import { StoreContext } from "redux-react-hook";
import { useContext, useCallback } from "react";

import useApi from "./useApi";
import { Credentials, PasswordValidationRequest } from "./types";
import { useActionCreators } from "./redux";

interface UseAuthentication {
  login: (
    credentials: Credentials,
    formikActions: FormikActions<Credentials>
  ) => void;
}

const useAuthentication = (): UseAuthentication => {
  const { apiLogin } = useApi();
  const { showLoader } = useActionCreators();
  const login = useCallback(
    (credentials: Credentials, formikActions: FormikActions<Credentials>) => {
      const { setStatus, setSubmitting } = formikActions;
      showLoader(true);
      apiLogin(credentials).then(response => {
        if (response.loginSuccessful) {
          // Otherwise we'll extract what we expect to be the successful login redirect URL
          Cookies.set("username", credentials.email);
          window.location.href = response.redirectUrl;
        } else {
          setStatus(response.message);
          setSubmitting(false);
        }
        return;
      });
    },
    [apiLogin]
  );

  return { login };
};

export default useAuthentication;
