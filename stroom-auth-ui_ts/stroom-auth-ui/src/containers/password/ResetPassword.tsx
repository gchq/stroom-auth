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
import * as jwtDecode from "jwt-decode";

import { useReduxState } from "../../lib/useReduxState";
import ChangePasswordFields from "./ChangePasswordFields";
import {useApi, useActionCreators } from "../../api/authentication";
import useHttpQueryParam from "../../lib/useHttpQueryParam";

const ResetPassword = () => {
  const { resetPassword } = useApi();

  const { showAlert } = useReduxState(({ user: { showAlert } }) => ({
    showAlert
  }));
  const [missingToken, setMissingToken] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const [expiredToken, setExpiredToken] = useState(false);
  const { changeToken } = useActionCreators();

  useEffect(() => {
    let missingToken = false;
    let invalidToken = false;
    let expiredToken = false;
    const token = useHttpQueryParam("token");

    // Validate token
    if (!token) {
      missingToken = true;
    } else {
      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const now = new Date().getTime() / 1000;
        expiredToken = decodedToken.exp <= now;
      } catch (err) {
        invalidToken = true;
      }
    }

    setMissingToken(missingToken);
    setInvalidToken(invalidToken);
    setExpiredToken(expiredToken);

    if (!missingToken && !invalidToken && !expiredToken && token) {
      // If we have a valid token we're going to save it, so we can easily
      // use it with getState when requesting the change.
      changeToken(token);
    }
  }, [changeToken, setMissingToken, setInvalidToken, setExpiredToken]);

  const failure = (
    <div>
      <h4>Unable to reset password!</h4>
      {missingToken || invalidToken ? (
        <p>I'm afraid this password reset link is broken.</p>
      ) : (
        undefined
      )}
      {expiredToken ? (
        <p>I'm afraid this password reset link has expired.</p>
      ) : (
        undefined
      )}
    </div>
  );

  const showFailure = missingToken || invalidToken || expiredToken;
  const showChangePasswordFields = !showAlert && !showFailure;
  return (
    <div className="container">
      <div className="section">
        <div className="section__title">
          <h3>Reset your password</h3>
        </div>
        {showFailure ? failure : undefined}
        {showChangePasswordFields ? (
          <ChangePasswordFields
            showOldPasswordField={false}
            onSubmit={resetPassword}
          />
        ) : (
          undefined
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
