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
import PropTypes from 'prop-types';
import {Field, ErrorMessage} from 'formik';
import * as moment from 'moment';

import './UserFields.css';
import {UpdatedCopy, LoginStatsCopy, CreatedCopy} from '../../auditCopy';

const LoginFailureCopy = ({attemptCount}) => (
  <div className="copy">
    Login attempts with an incorrect password: {attemptCount}
  </div>
);

const UserFields = ({
  showCalculatedFields,
  errors,
  touched,
  userBeingEdited,
}) => (
  <div className="container">
    <div className="section">
      <div className="section__title">
        <h3>Account</h3>
      </div>
      <div className="section__fields">
        <div className="section__fields__row">
          <div className="field-container vertical">
            <label>First name</label>
            <Field name="first_name" type="text" label="First name" />
          </div>
          <div className="field-container vertical">
            <label>Email</label>
            <div className="field-container--with-validation">
              <Field name="email" label="Email" />
              <ErrorMessage
                name="email"
                render={msg => <div className="validation-error">{msg}</div>}
              />
            </div>
          </div>
        </div>

        <div className="section__fields__row">
          <div className="field-container vertical">
            <label>Last name</label>
            <Field name="last_name" type="text" label="Last name" />
          </div>
          <div className="field-container vertical">
            <label>Account status</label>
            <Field name="state" component="select">
              <option value="enabled">Active</option>
              <option value="disabled">Inactive</option>
              <option value="locked">Locked</option>
            </Field>
          </div>
        </div>
      </div>
    </div>

    <div className="section">
      <div className="section__title">
        <h3>Password</h3>
        <p className="section__subtitle">
          You can change this user's password here
        </p>
      </div>
      <div className="section__fields">
        <div className="section__fields__row">
          <div className="field-container vertical">
            <label>Password</label>
            <div className="field-container--with-validation">
              <Field name="password" type="password" label="Password" />
              <ErrorMessage
                name="password"
                render={msg => <div className="validation-error">{msg}</div>}
              />
            </div>
          </div>
          <div className="field-container vertical">
            <label>Verify password</label>
            <div className="field-container--with-validation">
              <Field name="verifyPassword" type="password" />
              <ErrorMessage
                name="verifyPassword"
                render={msg => <div className="validation-error">{msg}</div>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="section">
      <div className="section__title">
        <h3>Comments</h3>
      </div>
      <div className="section__fields">
        <div className="section__fields__row 1-column">
          <Field
            className="section__fields__comments"
            name="comments"
            type="textarea"
          />
        </div>
      </div>
    </div>

    {showCalculatedFields ? (
      <React.Fragment>
        <div className="section">
          <div className="section__title">
            <h3>Statistics</h3>
          </div>
          <div className="section__fields--copy-only">
            <div className="section__fields_row">
              <LoginFailureCopy attemptCount={userBeingEdited.login_count} />
              <LoginStatsCopy
                lastLogin={userBeingEdited.last_login}
                loginCount={userBeingEdited.login_count}
              />
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section__title">
            <h3>Audit</h3>
          </div>
          <div className="section__fields--copy-only">
            <div className="section__fields__rows">
              <UpdatedCopy
                updatedBy={userBeingEdited.updated_by_user}
                updatedOn={userBeingEdited.updated_on}
              />
              <CreatedCopy
                createdBy={userBeingEdited.created_by_user}
                createdOn={userBeingEdited.created_on}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    ) : (
      undefined
    )}
  </div>
);

UserFields.propTypes = {
  showCalculatedFields: PropTypes.bool.isRequired,
};

export default UserFields;
