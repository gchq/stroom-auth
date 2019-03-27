/*
 * Copyright 2017 Crown Copyright
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

import * as React from "react";
import { useState, useEffect } from "react";
import * as Cookies from "cookies-js";
import * as queryString from "query-string";

import "./ChangePassword.css";
import "../../styles/Layout.css";
import ChangePasswordFields from "./ChangePasswordFields";

import useRouter from "../../lib/useRouter";
import useReduxState from "../../lib/useReduxState";
import { useApi as useAuthenticationApi } from "../../api/authentication";

const ChangePassword = () => {
  const { showAlert } = useReduxState(
    ({
      user: { showAlert, changePasswordErrorMessage },
      config: {
        values: { authenticationServiceUrl }
      },
      authentication: { idToken }
    }) => ({
      showAlert,
      changePasswordErrorMessage,
      authenticationServiceUrl,
      idToken
    })
  );
  const { changePassword } = useAuthenticationApi();
  const { router } = useRouter();
  const [redirectUrl, setRedirectUrl] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!!router.location) {
      const query = queryString.parse(router.location.search);

      const redirectUrl: string = query.redirect_url as string;
      if (!!redirectUrl) {
        const decodedRedirectUrl: string = decodeURIComponent(redirectUrl);
        setRedirectUrl(decodedRedirectUrl);
      }

      let email: string = query.email as string;
      if (email === undefined) {
        email = Cookies.get("username");
      }

      if (email) {
        setEmail(email);
      } else {
        console.error(
          "Unable to display the change password page because we could not get the user's email address from either the query string or a cookie!"
        );
      }
    }

    // Try and get the user's email from the query string, and fall back on a cookie.
  }, [setRedirectUrl, setEmail]);

  let title = "Change your password";
  if (showAlert && redirectUrl) {
    title = "Your password has been changed";
  }

  return (
    <div className="container">
      <div className="section">
        <div className="section__title">
          <h3>{title} </h3>
        </div>
        {!showAlert ? (
          <ChangePasswordFields
            email={email}
            redirectUrl={redirectUrl}
            showOldPasswordField={true}
            onSubmit={changePassword}
          />
        ) : (
          undefined
        )}
        {showAlert && !redirectUrl ? (
          <p>Your password has been changed.</p>
        ) : (
          undefined
        )}
        }
      </div>
    </div>
  );
};

export default ChangePassword;
