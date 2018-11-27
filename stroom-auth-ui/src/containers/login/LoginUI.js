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
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {compose} from 'recompose';
import Card from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {TextField} from 'redux-form-material-ui';
import * as Yup from 'yup';

import Button from '../Button';
import {hasAnyProps} from '../../lang';
import './Login.css';
import '../Layout.css';
import icon from '../../icon.png';
import {required} from '../../validations';
import {login as onSubmit} from '../../modules/login';

const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const enhance = compose(
  connect(
    ({config: {allowPasswordResets}}) => ({allowPasswordResets}),
    {onSubmit},
  ),
);

const LoginForm = ({
  handleSubmit,
  pristine,
  submitting,
  allowPasswordResets,
  onSubmit,
}) => {
  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{email: '', password: ''}}
      validationSchema={LoginValidationSchema}>
      {({errors, touched, submitForm, isSubmitting, status}) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <div className="content-floating-without-appbar">
            <Card className="Login-card">
              <Form>
                <div>
                  <div className="LoginForm-iconContainer">
                    <Avatar className="LoginForm-icon" src={icon} size={100} />
                  </div>
                  <div>
                    <label>Email</label>
                    <Field name="email" autoFocus />
                    <ErrorMessage
                      name="email"
                      render={msg => (
                        <div className="validation-error">{msg}</div>
                      )}
                    />
                  </div>
                  <label>Password</label>
                  <Field name="password" type="password" />
                  <ErrorMessage
                    name="password"
                    render={msg => (
                      <div className="validation-error">{msg}</div>
                    )}
                  />
                  <br />
                  <Button
                    className="toolbar-button-large primary"
                    disabled={isPristine || hasErrors}
                    type="submit"
                  isLoading={isSubmitting}>
                    Sign in
                  </Button>
                  <p>{status}</p>
                  <br />
                  {allowPasswordResets ? (
                    <NavLink to={'/resetPasswordRequest'}>
                      <p className="LoginForm-resetPasswordText">
                        Reset password?
                      </p>
                    </NavLink>
                  ) : (
                    undefined
                  )}
                </div>
              </Form>
            </Card>
          </div>
        );
      }}
    </Formik>
  );
};

export default enhance(LoginForm);
