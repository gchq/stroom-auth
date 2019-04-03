
import { useCallback } from "react";
import { FormikBag } from 'formik';

import { useApi } from "src/api/authentication";
import { useRouter } from 'src/lib/useRouter';
import { ResetPasswordRequest, ChangePasswordResponse } from 'src/api/authentication/types';
import { useConfig } from 'src/startup/config';

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

  const { stroomUiUrl } = useConfig();
  const resetPassword = useCallback((resetPasswordRequest: ResetPasswordRequest) => {
    resetPasswordUsingApi(resetPasswordRequest)
      .then((response: ChangePasswordResponse) => {
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
