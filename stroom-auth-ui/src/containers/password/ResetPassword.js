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
import PropTypes, {object} from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {withRouter} from 'react-router';
import {compose, withState, lifecycle} from 'recompose';
import queryString from 'query-string';
import jwtDecode from 'jwt-decode';
import Countdown from 'react-countdown-now';

import ChangePasswordFields from './ChangePasswordFields';
import {changeToken} from '../../modules/login';
import {resetPassword as onSubmit} from '../../modules/user';

const enhance = compose(
  withRouter,
  connect(
    ({user: {showAlert}}) => ({showAlert}),
    {
      changeToken,
      onSubmit,
        push,
    },
  ),
  withState('missingToken', 'setMissingToken', false),
  withState('invalidToken', 'setInvalidToken', false),
  withState('expiredToken', 'setExpiredToken', false),
  lifecycle({
    componentDidMount() {
      const {
        setMissingToken,
        setInvalidToken,
        setExpiredToken,
        changeToken,
      } = this.props;
      let missingToken = false;
      let invalidToken = false;
      let expiredToken = false;

      const token = queryString.parse(this.props.location.search).token;

      // Validate token
      if (!token) {
        missingToken = true;
      } else {
        try {
          const decodedToken = jwtDecode(token);
          const now = new Date().getTime() / 1000;
          expiredToken = decodedToken.exp <= now;
        } catch (err) {
          invalidToken = true;
        }
      }

      setMissingToken(missingToken);
      setInvalidToken(invalidToken);
      setExpiredToken(expiredToken);

      if (!missingToken && !invalidToken && !expiredToken) {
        changeToken(token);
        //        this.context.store.dispatch(push('/resetpassword'));
      }
    },
  }),
);

const ResetPassword = ({
  onSubmit,
  missingToken,
  invalidToken,
  expiredToken,
  showAlert,
    push,
}) => {
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

  const confirmation = (
    <p>
      You password has been changed. We're going to send you to the login page in&nbsp;
      <Countdown
        date={Date.now() + 5000}
        renderer={({hours, minutes, seconds, completed}) => (
          <span className="ChangePassword-countdown">{seconds}</span>
        )}
        onComplete={() => {
            push('/login');
        }}
      />
      &nbsp;seconds, or you can <a href='/login'>go there now.</a>
    </p>
  );

  const showFailure = missingToken || invalidToken || expiredToken;
  const showChangePasswordFields = !showAlert && !showFailure;
  return (
    <div className="container">
      <div className="section">
        <div className="section__title">
          <h3>Reset your password</h3>
        </div>
        {showAlert ? confirmation : undefined}
        {showFailure ? failure : undefined}
        {showChangePasswordFields ? (
          <ChangePasswordFields
            showOldPasswordField={false}
            onSubmit={onSubmit}
          />
        ) : (
          undefined
        )}
      </div>
    </div>
  );
};

export default enhance(ResetPassword);
