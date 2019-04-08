import * as Cookies from "cookies-js";
import { FormikActions } from "formik";
import { useCallback } from "react";

import useApi from "./useApi";
import { Credentials, PasswordValidationRequest } from "./types";

interface UseAuthentication {
  login: (
    credentials: Credentials,
    formikActions: FormikActions<Credentials>
  ) => void;
}

const useAuthentication = (): UseAuthentication => {
  const { apiLogin } = useApi();
  const login = useCallback(
    (credentials: Credentials, formikActions: FormikActions<Credentials>) => {
      const { setStatus, setSubmitting } = formikActions;
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
