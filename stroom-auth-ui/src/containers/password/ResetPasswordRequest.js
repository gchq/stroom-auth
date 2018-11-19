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
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {compose} from 'recompose';
import {push} from 'react-router-redux';
import * as Yup from 'yup';

import Button from '../Button';
import '../Layout.css';
import {required} from '../../validations';
import {submitPasswordChangeRequest as onSubmit} from '../../modules/user';
import {hasAnyProps} from '../../lang';
import '../../styles/index.css';

const ValidationSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
});

const enhance = compose(
  connect(
    ({password:{isSubmitting}}) => ({isSubmitting}),
    {push, onSubmit},
  ),
);

const ResetPasswordRequest = ({isSubmitting, onSubmit, push}) => {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        email: '',
      }}
      onSubmit={(values, actions) => {
        onSubmit(values);
      }}
      validationSchema={ValidationSchema}>
      {({errors, touched, submitForm}) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <Form>
            <div className="container">
              <div className="section">
                <div className="section__title">
                  <h3>Request a password reset</h3>
                </div>
                <div className="section__fields">
                  <div className="section__fields_row">
                    <div className="field-container vertical">
                      <label>Your registered email address</label>
                      <Field name="email" type="text" />
                      <ErrorMessage
                        name="email"
                        render={msg => (
                          <div className="validation-error">{msg}</div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer">
                <Button
                  className="toolbar-button-small primary"
                  type="submit"
                  disabled={isPristine || hasErrors}
                isLoading={isSubmitting}>
                  Send
                </Button>
                <Button
                  className="toolbar-button-small secondary"
                  onClick={() => push('/login')}>
                  Back to login
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default enhance(ResetPasswordRequest);
