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

import PostChangeRedirect from './PostChangeRedirect';
import Button from '../Button';
import {validateAsync} from '../users/validation';
import {changePasswordValidationSchema} from './validation';
import './ChangePassword.css';
import '../Layout.css';
import {required} from '../../validations';
import {changePassword as onSubmit} from '../../modules/user';
import {hasAnyProps} from '../../lang';
import ChangePasswordFields from './ChangePasswordFields';

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
            <ChangePasswordFields email={email} redirectUrl={redirectUrl} showOldPasswordField={true} onSubmit={onSubmit}/>
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
