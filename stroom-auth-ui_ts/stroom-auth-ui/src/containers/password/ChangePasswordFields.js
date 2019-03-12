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

import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {withRouter} from 'react-router';
import {Formik, Form, Field, ErrorMessage} from 'formik';

import Button from '../Button';
import {validateAsync} from '../users/validation';
import '../Layout.css';
import {hasAnyProps} from '../../lang';

const enhance = compose(
  withRouter,
  connect(
    ({
      user: {changePasswordErrorMessage},
      config: {authenticationServiceUrl},
      authentication: {idToken},
    }) => ({
      changePasswordErrorMessage,
      authenticationServiceUrl,
      idToken,
    }),
    {},
  ),
);

const ChangePasswordFields = ({
  // Props
  email,
  redirectUrl,
  showOldPasswordField,
  onSubmit,
  // Redux
  changePasswordErrorMessage,
  idToken,
  authenticationServiceUrl,
}) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        oldPassword: '',
        password: '',
        verifyPassword: '',
        email: email || '',
        redirectUrl: redirectUrl || '',
      }}
      onSubmit={(values, actions) => {
        onSubmit(values);
      }}
      validate={values =>
        validateAsync(values, idToken, authenticationServiceUrl)
      }>
      {({errors, touched, submitForm, isSubmitting}) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <Form className="ChangePassword-form">
            <div style={{display: 'none'}}>
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
                  {changePasswordErrorMessage.map((error, index) => (
                    <p key={index} className="ChangePassword-errorMessage">
                      {error}
                    </p>
                  ))}
                </div>
                <br />

                <div className="ChangePassword-actions">
                  <Button
                    className="ChangePassword-button primary"
                    isLoading={isSubmitting}
                    disabled={isPristine || hasErrors}
                    type="submit"
                    label=""
                    icon="save">
                    Change password
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default enhance(ChangePasswordFields);
