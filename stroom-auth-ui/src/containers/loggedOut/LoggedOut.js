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
import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';

import Button from '../Button';
import {logout} from '../../modules/login';
import './LoggedOut.css';
import '../Layout.css';

const enhance = compose(
  connect(
    ({config: {stroomUiUrl}}) => ({stroomUiUrl}),
    {logout},
  ),
  lifecycle({
    componentWillMount() {
      this.props.logout();
    },
  }),
);

const LoggedOut = ({stroomUiUrl}) => {
  return (
    <div className="content-floating-without-appbar">
      <div className="LoggedOut">
        <h3>You have been logged out</h3>
        <div class="LoggedOut__actions">
          <Button
            className="toolbar-button-medium primary"
            onClick={() => (window.location.href = stroomUiUrl)}>
            Return to Stroom
          </Button>
        </div>
      </div>
    </div>
  );
};

export default enhance(LoggedOut);
