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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes, {object} from 'prop-types';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {TextField} from 'redux-form-material-ui';
import Countdown from 'react-countdown-now';
import {compose, withState, lifecycle} from 'recompose';
import {withRouter} from 'react-router';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {Card, CardTitle} from 'material-ui/Card';
import Cookies from 'cookies-js';
import queryString from 'query-string';

import PostChangeRedirect from '../PostChangeRedirect';
import Button from '../../Button';
import {validateAsync} from '../../users/validation';
import {changePasswordValidationSchema} from '../validation';
import './ChangePassword.css';
import '../../Layout.css';
import {required} from '../../../validations';
import {changePassword as onSubmit} from '../../../modules/user';
import {hasAnyProps} from '../../../lang';

const enhance = compose(
  withRouter,
  connect(
    ({
      user: {showAlert, changePasswordErrorMessage},
      config: {authenticationServiceUrl},
      authentication: {idToken},
    }) => ({
      showAlert,
      changePasswordErrorMessage,
      authenticationServiceUrl,
      idToken,
    }),
    {onSubmit},
  ),
  withState('redirectUrl', 'setRedirectUrl', undefined),
  withState('email', 'setEmail', undefined),
  lifecycle({
    componentDidMount() {
      const {setRedirectUrl, setEmail} = this.props;
      const query = queryString.parse(this.props.location.search);

      if (query.redirect_url) {
        const redirectUrl = decodeURIComponent(query.redirect_url);
        setRedirectUrl(redirectUrl);
      }

      // Try and get the user's email from the query string, and fall back on a cookie.
      let email;
      if (query.email) {
        email = query.email;
      } else {
        email = Cookies.get('username');
      }
      if (email) {
        setEmail(email);
      } else {
        console.error(
          "Unable to display the change password page because we could not get the user's email address from either the query string or a cookie!",
        );
      }
    },
  }),
  reduxForm({
    form: 'ChangePasswordForm',
  }),
);

const ChangePassword = ({
  handleSubmit,
  pristine,
  submitting,
  showAlert,
  changePasswordErrorMessage,
  redirectUrl,
  email,
  idToken,
  authenticationServiceUrl,
  onSubmit,
}) => {
  let title = 'Change your password';
  if (showAlert && redirectUrl) {
    title = 'Your password has been changed';
  }

  return (
    <div className="container">
      <div className="section">
        <div className="section__title">
          <h3>{title}</h3>
        </div>
        {!showAlert ? (
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
            {({errors, touched, submitForm}) => {
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
                      <div className="field-container vertical">
                        <label>Old password</label>
                        <Field name="oldPassword" type="password" autoFocus />
                      </div>
                      <div className="field-container__spacer" />
                      <div className="field-container vertical">
                        <label>New password</label>
                        <Field name="password" type="password" />
                      </div>
                    </div>
                    <div className="section__fields__row">
                      <div className="field-container vertical" />
                      <div className="field-container__spacer" />
                      <div className="field-container vertical">
                        <label>New password again</label>
                        <Field name="verifyPassword" type="password" />
                      </div>
                    </div>
                    <div className="ChangePassword-controls">
                      <div>
                        <ErrorMessage
                          name="oldPassword"
                          render={msg => (
                            <div className="validation-error">{msg}</div>
                          )}
                        />
                        <ErrorMessage
                          name="password"
                          render={msg => (
                            <div className="validation-error">{msg}</div>
                          )}
                        />
                        <ErrorMessage
                          name="verifyPassword"
                          render={msg => (
                            <div className="validation-error">{msg}</div>
                          )}
                        />
                        {changePasswordErrorMessage.map((error, index) => (
                          <p
                            key={index}
                            className="ChangePassword-errorMessage">
                            {error}
                          </p>
                        ))}
                      </div>
                      <br />

                      <div className="ChangePassword-actions">
                        <Button
                          className="ChangePassword-button primary"
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
        ) : (
          undefined
        )}

        {showAlert && !redirectUrl ? (
          <p>Your password has been changed.</p>
        ) : (
          undefined
        )}

        {showAlert && redirectUrl ? (
          <PostChangeRedirect redirectUrl={redirectUrl} />
        ) : (
          undefined
        )}
      </div>
    </div>
  );
};

export default enhance(ChangePassword);
