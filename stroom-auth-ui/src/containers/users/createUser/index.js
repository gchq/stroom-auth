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
import {Formik, Form} from 'formik';
import {compose} from 'recompose';
import {push} from 'react-router-redux';

import './CreateUserForm.css';
import '../../Layout.css';
import UserFields from '../UserFields';
import {createUser as onSubmit} from '../../../modules/user';
import {hasAnyProps} from '../../../lang';
import {NewUserValidationSchema, validateAsync} from '../validation';
import Button from '../../Button';

const enhance = compose(
  connect(
    ({
      authentication: {idToken},
      user: {isSaving},
      config: {authenticationServiceUrl},
    }) => ({
      idToken,
      authenticationServiceUrl,
      isSaving,
    }),
    {onSubmit, push},
  ),
);

// If we don't pass initialValues to Formik then they won't be controlled
// and we'll get console errors when they're used.
const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  state: 'enabled',
  password: '',
  verifyPassword: '',
  comments: '',
};

const UserCreateForm = ({
  onSubmit,
  idToken,
  authenticationServiceUrl,
  isSaving,
  push,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values);
      }}
      validate={values =>
        validateAsync(values, idToken, authenticationServiceUrl)
      }
      validationSchema={NewUserValidationSchema}>
      {({errors, touched, setFieldTouched}) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <Form>
            <div className="header">
              <Button
                className="primary toolbar-button-small"
                icon="arrow-left"
                onClick={() => push('/userSearch')}>
                Back
              </Button>
            </div>
            <UserFields
              showCalculatedFields={false}
              errors={errors}
              touched={touched}
              setFieldTouched={setFieldTouched}
            />
            <div className="footer">
              <Button
                className="toolbar-button-small primary"
                disabled={isPristine || hasErrors}
                type="submit"
                icon="save"
                isLoading={isSaving}>
                Save
              </Button>
              <Button
                className="toolbar-button-small secondary"
                icon="times"
                onClick={() => push('/userSearch')}>
                Cancel
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default enhance(UserCreateForm);
