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
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Snackbar from 'material-ui/Snackbar';
import CopyToClipboard from 'react-copy-to-clipboard';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import {compose, lifecycle} from 'recompose';

import Loader from '../../Loader';
import './TokenEdit.css';
import '../../../styles/form.css';
import {toggleEnabledState} from '../../../modules/token';
import {OnCopy, ByCopy} from '../../auditCopy';

const enhance = compose(
  connect(
    ({token: {lastReadToken}, user: {showAlert, alertText}}) => ({
      token: lastReadToken,
      showAlert,
      alertText,
    }),
    {
      toggleEnabledState,
    },
  ),
  lifecycle({
    componentDidMount() {},
  }),
  //  branch(({token}) => !token, renderComponent(() => <div>Loading...</div>)),
);

const TokenEditUi = props => {
  const {
    token,
    showAlert,
    alertText,
    handleSubmit,
    toggleAlertVisibility,
    form,
    toggleEnabledState,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="header">
        <NavLink to="/tokens">
          <button className="primary toolbar-button-small">
            <FontAwesomeIcon icon="arrow-left" /> Back
          </button>
        </NavLink>
      </div>
      {token === undefined ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="container">
          <div className="section">
            <div className="section__title">
              <h3>Details</h3>
            </div>
            <div className="section__fields">
              <div className="section__fields__row">
                <div className="field-container">
                  <div className="label-container">
                    <label>Enabled</label>
                  </div>
                  <Checkbox
                    defaultChecked={token.enabled}
                    checked={token.enabled}
                    onChange={toggleEnabledState}
                  />
                </div>
              </div>
              <ByCopy by={token.user_email} verb="Issued to" />
              <OnCopy on={token.expires_on} verb="Expires" />
            </div>
          </div>
          <div className="section">
            <div className="section__title">
              <h3>Audit</h3>
            </div>
            <div className="section__fields">
              <OnCopy on={token.issued_on} verb="Issued" />
              <ByCopy by={token.issued_by_user} verb="Issued by" />
              <OnCopy on={token.updated_on} verb="Updated" />
              <ByCopy by={token.updated_by_user} verb="Updated by" />
            </div>
          </div>
          <div className="section">
            <div className="section__title">
              <h3>API key</h3>
            </div>
            <div className="section__fields--copy-only constrained">
              <textarea value={token.token} disabled />
              <CopyToClipboard text={token.token}>
                <button className="primary">
                  <FontAwesomeIcon icon="copy" /> Copy key
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      )}
      <Snackbar
        open={showAlert}
        message={alertText}
        autoHideDuration={4000}
        onRequestClose={() => toggleAlertVisibility('')}
      />
    </form>
  );
};

export default enhance(TokenEditUi);
