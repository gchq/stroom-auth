import * as Cookies from "cookies-js";
import { Credentials } from "./types";
import { StoreContext } from "redux-react-hook";
import { useContext, useCallback } from "react";
import useApi from "./useApi";
import { useActionCreators } from "./redux";
import { FormikActions } from "formik";
import { GlobalStoreState } from '../../modules';

interface UseAuthentication {
  login: (
    credentials: Credentials,
    formikActions: FormikActions<Credentials>
  ) => void;
  // changePasswordForCurrentUser: () => void;
}

const useAuthentication = () => {
  const store = useContext(StoreContext);

  const { apiLogin } = useApi();
  const { showLoader, changeEmail } = useActionCreators();
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

  // const {
  //   // changePasswordForCurrentUser: apiChangePasswordForCurrentUser,
  //   changePassword: apiChangePassword
  // } = useApi();
  // const changePasswordForCurrentUser = useCallback(() => {
  //     const state:GlobalStoreState = store.getState();
  //     apiChangePassword({email});
  //   // apiChangePasswordForCurrentUser()
  //   //   .then(users => users[0])
  //   //   .then(user => {
  //   //     apiChangePassword(user.email);
  //   //   });
  // }, [apiChangePassword]);

  return {
    login,
    // changePasswordForCurrentUser
  };
};

export default useAuthentication;
