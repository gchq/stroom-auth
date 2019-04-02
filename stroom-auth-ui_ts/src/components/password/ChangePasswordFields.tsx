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
import { Formik, Form, Field, ErrorMessage } from "formik";

import "../../styles/Layout.css";
import Button from "../Button";
import useReduxState from "../../lib/useReduxState";
import { PasswordValidationRequest } from "../../api/authentication/types";
import { hasAnyProps } from "../../lib/lang";
import { validateAsync } from "../users/validation";

const ChangePasswordFields = ({
  email,
  redirectUrl,
  showOldPasswordField,
  onSubmit
}: {
  email?: string;
  redirectUrl?: string;
  showOldPasswordField: boolean;
  onSubmit: Function;
}) => {
  const {
    changePasswordErrorMessage,
    authenticationServiceUrl,
    idToken
  } = useReduxState(
    ({
      user: { changePasswordErrorMessage },
      config: {
        values: { authenticationServiceUrl }
      },
      authentication: { idToken }
    }) => ({ changePasswordErrorMessage, authenticationServiceUrl, idToken })
  );
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        oldPassword: "",
        password: "",
        verifyPassword: "",
        email: email || "",
        redirectUrl: redirectUrl || ""
      }}
      onSubmit={values => {
        onSubmit(values);
      }}
      validate={values => {
        const passwordValidationRequest: PasswordValidationRequest = {
          oldPassword: values.oldPassword,
          newPassword: values.password,
          verifyPassword: values.verifyPassword,
          email: values.email
        };
        return validateAsync(
          passwordValidationRequest,
          idToken,
          authenticationServiceUrl
        );
      }}
    >
      {({ errors, touched }) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <Form className="ChangePassword-form">
            <div style={{ display: "none" }}>
              <Field
                className="redirectUrl-field"
                name="redirectUrl"
                type="hidden"
              />
              <Field className="email-field" name="email" type="hidden" />
            </div>

            <div className="section__fields">
              <div className="section__fields__row">
                {showOldPasswordField ? (
                  <div className="field-container vertical">
                    <label>Old password</label>
                    <Field name="oldPassword" type="password" autoFocus />
                    <ErrorMessage
                      name="oldPassword"
                      render={msg => (
                        <div className="validation-error">{msg}</div>
                      )}
                    />
                  </div>
                ) : (
                    <div className="field-container vertical" />
                  )}

                <div className="field-container__spacer" />

                <div className="field-container vertical">
                  <label>New password</label>
                  <Field name="password" type="password" />
                  <ErrorMessage
                    name="password"
                    render={msg => (
                      <div className="validation-error">{msg}</div>
                    )}
                  />
                </div>
              </div>

              <div className="section__fields__row">
                <div className="field-container vertical" />
                <div className="field-container__spacer" />
                <div className="field-container vertical">
                  <label>New password again</label>
                  <Field name="verifyPassword" type="password" />
                  <ErrorMessage
                    name="verifyPassword"
                    render={msg => (
                      <div className="validation-error">{msg}</div>
                    )}
                  />
                </div>
              </div>

              <div className="ChangePassword-controls">
                <div>
                  {changePasswordErrorMessage.map(
                    (error: string, index: string) => (
                      <p key={index} className="ChangePassword-errorMessage">
                        {error}
                      </p>
                    )
                  )}
                </div>
                <br />

                <div className="ChangePassword-actions">
                  <Button
                    className="ChangePassword-button primary"
                    disabled={isPristine || hasErrors}
                    type="submit"
                    icon="save"
                    text="Change password"
                  />
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ChangePasswordFields;
