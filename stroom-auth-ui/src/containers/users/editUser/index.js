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
import {withRouter} from 'react-router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Formik, Form} from 'formik';
import PropTypes, {object} from 'prop-types';
import {
  withProps,
  branch,
  lifecycle,
  compose,
  renderComponent,
} from 'recompose';

import './EditUser.css';
import UserFields from '../userFields';
import {
  saveChanges as onSubmit,
  toggleAlertVisibility,
  fetchUser,
  clearUserBeingEdited,
} from '../../../modules/user';
import {hasAnyProps} from '../../../lang';
import {UserValidationSchema, validateAsync} from '../validation';

const enhance = compose(
  withRouter,
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
    {
      onSubmit,
      clearUserBeingEdited,
      fetchUser,
      toggleAlertVisibility,
    },
  ),
  lifecycle({
    componentDidMount() {
      const userId = this.props.match.params.userId;
      this.props.clearUserBeingEdited();
      this.props.fetchUser(userId);
    },
  }),
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

const UserEditForm = ({
    userBeingEdited,
    idToken,
    authenticationServiceUrl,
    onSubmit,
  }) => {
  return (
    <Formik
      onSubmit={(values, actions) => {
        onSubmit(values);
      }}
      initialValues={{...userBeingEdited}}
      validate={values =>
        validateAsync(values, idToken, authenticationServiceUrl)
      }
      validationSchema={UserValidationSchema}>
      {({errors, touched}) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
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

UserEditForm.contextTypes = {
  store: PropTypes.object.isRequired,
  router: PropTypes.shape({
    history: object.isRequired,
  }),
};

export default enhance(UserEditForm);
