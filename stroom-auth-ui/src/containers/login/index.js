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
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {compose, withProps, lifecycle, withState} from 'recompose';
import queryString from 'query-string';

import LoginUI from './LoginUI';
import {
  changeRedirectUrl,
  changeClientIdUrl,
  changeSessionId,
} from '../../modules/login';

const enhance = compose(
  connect(
    ({authentication: {idToken}}) => ({idToken}),
    {changeRedirectUrl, changeClientIdUrl, changeSessionId},
  ),
  lifecycle({
    componentWillMount() {
      const {changeRedirectUrl, changeClientIdUrl, changeSessionId} = this.props;
      const {location} = this.props;

      const queryParams = queryString.parse(location.search);
      const redirectUrl = queryParams['redirectUrl'];
      const clientId = queryParams['clientId'];
      const sessionId = queryParams['sessionId'];

      changeRedirectUrl(redirectUrl);
      changeClientIdUrl(clientId);
      changeSessionId(sessionId);
    },
  }),
);

const Login = ({idToken}) => {
  return <div>{idToken ? <Redirect to={'/login'} /> : <LoginUI />}</div>;
};

export default enhance(Login);
