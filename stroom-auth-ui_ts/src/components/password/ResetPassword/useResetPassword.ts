
import { useCallback, useContext } from "react";
import { StoreContext } from "redux-react-hook";
import { FormikBag } from 'formik';

import { useApi } from "src/api/authentication";
import { useRouter } from 'src/lib/useRouter';
import { ResetPasswordRequest, ChangePasswordResponse } from 'src/api/authentication/types';
import { GlobalStoreState } from 'src/startup/GlobalStoreState';

const useResetPassword = (): {
  submitPasswordChangeRequest: (formData: any, formikBag: FormikBag<any, any>) => void;
  resetPassword: (resetPasswordRequest: ResetPasswordRequest) => void;
} => {

  const { history } = useRouter();
  const { submitPasswordChangeRequest: submitPasswordChangeRequestUsingApi, resetPassword: resetPasswordUsingApi } = useApi();
  const submitPasswordChangeRequest = useCallback(
    (formData: any, formikBag: FormikBag<any, any>) => {
      submitPasswordChangeRequestUsingApi(formData, formikBag)
        .then(() => history.push("/confirmPasswordResetEmail"));
    },
    []
  );

  const store = useContext(StoreContext);
  const resetPassword = useCallback((resetPasswordRequest: ResetPasswordRequest) => {
    resetPasswordUsingApi(resetPasswordRequest)
      .then((response: ChangePasswordResponse) => {
        const state: GlobalStoreState = store.getState();
        const stroomUiUrl = state.config.values.stroomUiUrl;
        if (response.changeSucceeded) {
          if (stroomUiUrl !== undefined) {
            window.location.href = stroomUiUrl;
          } else {
            console.error("No stroom UI url available for redirect!");
          }
        } else {
          let errorMessage = [];
          if (response.failedOn.includes("COMPLEXITY")) {
            errorMessage.push(
              "Your new password does not meet the complexity requirements"
            );
          }
          if (response.failedOn.includes("LENGTH")) {
            errorMessage.push("Your new password is too short");
          }
        }
      }
      );

  }, []);

  return { submitPasswordChangeRequest, resetPassword };
};

export default useResetPassword;
