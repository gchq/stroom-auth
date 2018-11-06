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
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Formik, Form} from 'formik';
import {withProps, branch, compose, renderComponent} from 'recompose';
import * as Yup from 'yup';

import './EditUser.css';
import UserFields from '../userFields';
import {
  saveChanges as onSubmit,
  toggleAlertVisibility,
} from '../../../modules/user';

const enhance = compose(
  connect(
    ({
      user: {userBeingEdited, showAlert, alertText},
      authentication: {idToken},
      config: {authenticationServiceUrl},
    }) => ({
      userBeingEdited,
      showAlert,
      alertText,
      idToken,
      authenticationServiceUrl,
    }),
    {onSubmit, toggleAlertVisibility},
  ),
  branch(
    ({userBeingEdited}) => !userBeingEdited,
    renderComponent(() => <div>Loading data...</div>),
  ),
  withProps(({userBeingEdited}) => {
    userBeingEdited.password = undefined;
    userBeingEdited.verifyPassword = undefined;
    return {userBeingEdited};
  }),
);

const UserValidationSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
});

function hasAnyProps(object) {
  let hasProps = false;
  for (const prop in object) {
    if (object.hasOwnProperty(prop)) {
      hasProps = true;
    }
  }
  return hasProps;
}

const validate = (values, idToken, url) => {
  if (values.email !== undefined && values.password !== undefined) {
    if (
      values.verifyPassword !== undefined &&
      values.password !== values.verifyPassword
    ) {
      return {verifyPassword: 'Passwords do not match'};
    }

    return fetch(`${url}/isPasswordValid`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        email: values.email,
        newPassword: values.password,
      }),
    })
      .then(response => response.json())
      .then(body => {
        let asyncErrors = [];
        if (body.failedOn.length > 0) {
          body.failedOn.map(failureType => {
            if (failureType === 'LENGTH') {
              asyncErrors.push('Not long enough');
            } else if (failureType === 'COMPLEXITY') {
              asyncErrors.push('Does not meet complexity requirements');
            }
          });
        }
        if (asyncErrors.length > 0) {
          throw {password: asyncErrors.join('\n')};
        }
      });
  } else {
  }
};

const UserEditForm = props => {
  const {
    userBeingEdited,
    idToken,
    authenticationServiceUrl,
    handleSubmit,
    onSubmit,
  } = props;
  return (
    <Formik
      onSubmit={(values, actions) => {
        onSubmit(values);
      }}
      initialValues={{...userBeingEdited}}
      validate={values => validate(values, idToken, authenticationServiceUrl)}
      validationSchema={UserValidationSchema}>
      {({errors, touched}) => {
        let isPristine = !hasAnyProps(touched);
        let hasErrors = hasAnyProps(errors);
        return (
          <Form>
            <div className="header">
              <button
                className="toolbar-button-small"
                disabled={isPristine || hasErrors}
                type="submit">
                <FontAwesomeIcon icon="save" /> Save
              </button>
              <NavLink to="/userSearch">
                <button className="toolbar-button-small">
                  <FontAwesomeIcon icon="times" /> Cancel
                </button>
              </NavLink>
            </div>
            <UserFields
              showCalculatedFields
              constrainPasswordEditing
              userBeingEdited={userBeingEdited}
              errors={errors}
              touched={touched}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default enhance(UserEditForm);
