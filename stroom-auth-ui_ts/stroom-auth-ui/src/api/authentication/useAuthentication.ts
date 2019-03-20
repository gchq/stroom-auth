import * as Cookies from "cookies-js";
import { Credentials } from "./types";
import { useCallback } from "react";
import useApi from "./useApi";
import { useActionCreators } from "./redux";
import { FormikActions } from "formik";

interface UseAuthentication {
  login: (
    credentials: Credentials,
    formikActions: FormikActions<Credentials>
  ) => void;
}

export default (): UseAuthentication => {
  const { login: apiLogin } = useApi();
  const { showLoader } = useActionCreators();
  const login = useCallback(
    (credentials: Credentials, { setStatus, setSubmitting }) => {
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

  return {
    login
  };
};
