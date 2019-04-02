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
import "src/styles/Layout.css";
import ChangePasswordFields from "../ChangePasswordFields";

import useRouter from "src/lib/useRouter";
import usePassword from './useChangePassword';

const ChangePassword = () => {
  const { changePassword, errorMessages, showChangeConfirmation } = usePassword();
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
  if (showChangeConfirmation && redirectUrl) {
    title = "Your password has been changed";
  }

  let content;
  if (errorMessages.length === 0) {
    if (!showChangeConfirmation) {
      content =
        <ChangePasswordFields
          email={email}
          redirectUrl={redirectUrl}
          showOldPasswordField={true}
          onSubmit={changePassword}
        // errorMessages={errorMessages}
        />
    }
    else if (showChangeConfirmation && !redirectUrl) {
      content = <p>Your password has been changed.</p>
    }
  }
  else {
    content = <p>There were the following errors: {errorMessages} </p>
  }

  return (
    <div className="container">
      <div className="section">
        <div className="section__title">
          <h3>{title} </h3>
        </div>
        {content}
      </div>
    </div>
  );
};

export default ChangePassword;
