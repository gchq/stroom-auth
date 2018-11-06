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
import {Field} from 'formik';
import * as moment from 'moment';

import './UserFields.css';

const SERVER_DATE_TIME_FORMAT = 'ddd MMM Do YYYY, HH:mm:ss';
const DISPLAY_DATE_TIME_FORMAT = 'MMMM Do YYYY, h:mm:ss a';

const Validation = ({propertyName, errors, touched}) => {
  if (errors) {
    const error = errors[propertyName];
    const isTouched = touched[propertyName];
    if (error && isTouched) {
      return <div className="validation-error">{error}</div>;
    } else {
      return null;
    }
  } else return null;
};

const LoginFailureCopy = ({attemptCount}) => (
  <p>Login attempts with an incorrect password: {attemptCount}</p>
);

const LoginStatsCopy = ({lastLogin, loginCount}) => {
  if (lastLogin !== undefined) {
    lastLogin = moment(lastLogin, SERVER_DATE_TIME_FORMAT);
    const loginStatsCopy = (
      <div>
        <p>
          Last login: {lastLogin.fromNow()}, at{' '}
          {lastLogin.format(DISPLAY_DATE_TIME_FORMAT)}{' '}
        </p>
        <p>Total logins: {loginCount}</p>
      </div>
    );
    return loginStatsCopy;
  } else {
    return <div>This user has never logged in.</div>;
  }
};

const UpdatedCopy = ({updatedBy, updatedOn}) => {
  if (updatedOn !== undefined && updatedBy !== 'Never been updated') {
    updatedOn = moment(updatedOn, SERVER_DATE_TIME_FORMAT);
    return (
      <div>
        <p>
          This user account was updated {updatedOn.from()}, at{' '}
          {updatedOn.format(DISPLAY_DATE_TIME_FORMAT)}. It was updated by{' '}
          <em>{updatedBy}</em>.
        </p>
      </div>
    );
  } else {
    return <div>This user account has never been updated.</div>;
  }
};

const CreatedCopy = ({createdBy, createdOn}) => {
  if (createdOn !== undefined) {
    createdOn = moment(createdOn, SERVER_DATE_TIME_FORMAT);
    return (
      <div>
        <p>
          This user account was created {createdOn.from()}, at{' '}
          {createdOn.format(DISPLAY_DATE_TIME_FORMAT)}. It was created by{' '}
          <em>{createdBy}</em>.
        </p>
      </div>
    );
  }
};

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
            <Field name="email" label="Email" />
            <Validation
              propertyName="email"
              errors={errors}
              touched={touched}
            />
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
        <p>You can change this user's password here</p>
      </div>
      <div className="section__fields">
        <div className="section__fields__row">
          <div className="field-container vertical">
            <label>Password</label>
            <Field name="password" type="password" label="Password" />
            <Validation
              propertyName="password"
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="field-container vertical">
            <label>Verify password</label>
            <Field name="verifyPassword" type="password" />
            <Validation
              propertyName="verifyPassword"
              errors={errors}
              touched={touched}
            />
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
          <div className="section__fields">
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
          <div className="section__fields">
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
