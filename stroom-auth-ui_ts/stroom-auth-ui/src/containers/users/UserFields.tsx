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

import * as React from "react";
import { Field, ErrorMessage, FormikErrors, FormikTouched } from "formik";
import Toggle from "react-toggle";
import "react-toggle/style.css"

import "../../styles/form.css";
import { AuditCopy, LoginStatsCopy } from "../auditCopy";
import { User } from "../../api/users";

const LoginFailureCopy = ({ attemptCount }: { attemptCount: number }) => (
  <div className="copy">
    Login attempts with an incorrect password: {attemptCount}
  </div>
);

const CheckboxField = ({
  field,
  form: { touched, errors },
  ...props
}: {
  field: any; //FIXME
  form: any; //FIXME
}) => {
  return (
    <Toggle
      icons={false}
      checked={field.value}
      onChange={field.onChange}
      {...field}
      {...props}
    />
  );
};

const UserFields = ({
  showCalculatedFields,
  errors,
  touched,
  userBeingEdited,
  setFieldTouched,
  setFieldValue
}: {
  showCalculatedFields: boolean;
  errors: FormikErrors<User>;
  touched: FormikTouched<User>;
  userBeingEdited?: User;
  setFieldTouched: Function;
  setFieldValue: Function;
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
          <div className="field-container__spacer" />
          <div className="field-container vertical">
            <label>Last name</label>
            <Field name="last_name" type="text" label="Last name" />
          </div>
        </div>

        <div className="section__fields__row">
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
      </div>
    </div>

    <div className="section">
      <div className="section__title">
        <h3>Status</h3>
      </div>
      <div className="section__fields">
        <div className="section__fields__row">
          <div className="field-container vertical">
            <label>Account status</label>
            <Field
              name="state"
              component="select"
              onChange={(event: any) => {
                //FIXME
                setFieldValue("state", event.target.value);
                setFieldTouched("state");
              }}
            >
              <option value="enabled">Active</option>
              <option value="disabled">Disabled</option>
              <option disabled value="inactive">
                Inactive (because of disuse)
              </option>
              <option disabled value="locked">
                Locked (because of failed logins)
              </option>
            </Field>
          </div>
          <div className="field-container__spacer" />
          <div className="field-container">
            <label>Never expire</label>
            <div className="field-container__spacer" />
            <div className="field-container--with-validation">
              <Field
                name="never_expires"
                label="never_expires"
                component={CheckboxField}
              />
              <ErrorMessage
                name="never_expire"
                render={msg => <div className="validation-error">{msg}</div>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="section">
      <div className="section__title">
        <h3>Password</h3>
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
          <div className="field-container__spacer" />
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
        <div className="section__fields__row">
          <div className="field-container">
            <label>Force a password change at next login</label>
            <div className="field-container__spacer" />
            <div className="field-container--with-validation">
              <Field
                name="force_password_change"
                label="force_password_change"
                component={CheckboxField}
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
            component="textarea"
          />
        </div>
      </div>
    </div>

    {showCalculatedFields && !!userBeingEdited ? (
      <React.Fragment>
        {!!userBeingEdited.login_count ? (
          <div className="section">
            <div className="section__title">
              <h3>Recent activity</h3>
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
        ) : (
          undefined
        )}

        <div className="section">
          <div className="section__title">
            <h3>Audit</h3>
          </div>
          <div className="section__fields--copy-only">
            <div className="section__fields__rows">
              <AuditCopy
                createdOn={userBeingEdited.created_on}
                createdBy={userBeingEdited.created_by_user}
                updatedOn={userBeingEdited.updated_on}
                updatedBy={userBeingEdited.updated_by_user}
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

export default UserFields;
