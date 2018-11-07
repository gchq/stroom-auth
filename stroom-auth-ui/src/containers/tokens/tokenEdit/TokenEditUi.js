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

import React, {useEffect, Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Field, reduxForm} from 'redux-form';
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Snackbar from 'material-ui/Snackbar';
import CopyToClipboard from 'react-copy-to-clipboard';
import {useDispatch, useMappedState} from 'redux-react-hook';

import './TokenEdit.css';
import {toggleEnabledState} from '../../../modules/token';
import {
  saveChanges as onSubmit,
  toggleAlertVisibility,
} from '../../../modules/user';
import {renderField, renderCheckbox} from '../../../renderField';
import {UpdatedCopy, LoginStatsCopy, CreatedCopy} from '../../auditCopy';

const mapState = state => ({
  token: state.token.lastReadToken,
  showAlert: state.user.showAlert,
  alertText: state.user.alertText,
});

const TokenEditUi = props => {
  const {token, showAlert, alertText} = useMappedState(mapState);
  const {handleSubmit, toggleAlertVisibility, form, toggleEnabledState} = props;

  if (token === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <form onSubmit={handleSubmit}>
        <div className="header">
          <NavLink to="/tokens">
              <button className="primary toolbar-button-small"><FontAwesomeIcon icon='arrow-left'/> Back</button>
          </NavLink>
        </div>
        <div className="container">
          <div className="section">
            <div className="section__title">
              <h3>Details</h3>
            </div>
            <div className="section__fields">
              <div className="section__fields__row">
                <Field
                  disabled
                  className="TokenEditForm-field"
                  name="user_email"
                  label="Issued to"
                  type="text"
                  component={renderField}
                />
                <Field
                  disabled
                  className="TokenEditForm-field"
                  name="expires_on"
                  component={renderField}
                  type="text"
                  label="Expires on"
                />
              </div>
              <div className="section__fields__row">
                <div className="field-container--vertical">
                  <div className="label-container">
                    <label>Enabled</label>
                  </div>
                  <Field
                    className="TokenEditForm-field"
                    name="enabled"
                    component={renderCheckbox}
                    onChange={() => toggleEnabledState()}
                  />
                </div>
                <div className="field-container--vertical">
                  <label>Issued on</label>
                  <Field disabled name="issued_on" component={renderField} />
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section__title">
              <h3>Audit</h3>
            </div>
            <div className="section__fields">
              <UpdatedCopy
                updatedBy={token.updated_by_user}
                updatedOn={token.updated_on}
              />
            </div>
          </div>
          <div className="section">
            <div className="section__title">
              <h3>API key</h3>
              <div className="section__subtitle">
                <CopyToClipboard text={token.token}>
                  <button className="primary">
                    <FontAwesomeIcon icon="copy" /> Copy key
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="section__fields--copy-only constrained">{token.token}</div>
          </div>
        </div>
        <Snackbar
          open={showAlert}
          message={alertText}
          autoHideDuration={4000}
          onRequestClose={() => toggleAlertVisibility('')}
        />
      </form>
    );
  }
};

const ReduxTokenEditUi = reduxForm({
  form: 'TokenEditForm',
})(TokenEditUi);

const mapStateToProps = state => ({
  token: state.token.lastReadToken,
  showAlert: state.user.showAlert,
  alertText: state.user.alertText,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onSubmit,
      toggleAlertVisibility,
      toggleEnabledState,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxTokenEditUi);
