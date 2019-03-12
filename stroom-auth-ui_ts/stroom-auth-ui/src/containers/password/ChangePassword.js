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
import {compose, withState, lifecycle} from 'recompose';
import {withRouter} from 'react-router';
import Cookies from 'cookies-js';
import queryString from 'query-string';

import './ChangePassword.css';
import '../Layout.css';
import {changePassword as onSubmit} from '../../modules/user';
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
          <ChangePasswordFields
            email={email}
            redirectUrl={redirectUrl}
            showOldPasswordField={true}
            onSubmit={onSubmit}
          />
        ) : (
          undefined
        )}

        {showAlert && !redirectUrl ? (
          <p>Your password has been changed.</p>
        ) : (
          undefined
        )}
      </div>
    </div>
  );
};

export default enhance(ChangePassword);
