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

import * as React from 'react';
import {useEffect} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
// import {compose, lifecycle} from 'recompose';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import * as queryString from "qs";

import Button from '../Button';
import {hasAnyProps} from '../../lang';
import './Login.css';
import '../Layout.css';
import icon from '../../icon.png';
// import {login as onSubmit} from '../../modules/login';
import {useActionCreators, useApi} from '../../api/authentication';
import useReduxState from "../../lib/useReduxState";
import useRouter from "../../lib/useRouter";

// import {
//   changeRedirectUrl,
//   changeClientIdUrl,
//   changeSessionId,
// } from '../../modules/login';

const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

// const enhance = compose(
//   connect(
//     ({config: {allowPasswordResets}, authentication: {idToken}}) => ({
//       allowPasswordResets,
//       idToken,
//     }),
//     {onSubmit, changeRedirectUrl, changeClientIdUrl, changeSessionId},
//   ),
//   lifecycle({
//     componentWillMount() {
//       const {
//         setRedirectUrl,
//         changeClientIdUrl,
//         changeSessionId,
//       } = this.props;
//       const {location} = this.props;

//       const queryParams = queryString.parse(location.search);
//       const redirectUrl = queryParams['redirectUrl'];
//       const clientId = queryParams['clientId'];
//       const sessionId = queryParams['sessionId'];

//       changeRedirectUrl(redirectUrl);
//       changeClientIdUrl(clientId);
//       changeSessionId(sessionId);
//     },
//   }),
// );

const LoginForm = ({
  // handleSubmit,
  // pristine,
  // submitting,
  // allowPasswordResets,
  // onSubmit,
}) => {
  const {allowPasswordResets, idToken} = useReduxState(({
    config: {values:{allowPasswordResets}}, authentication: {idToken}}) => ({
      allowPasswordResets,
      idToken,
    }));
  const {login} = useApi();
  const {setRedirectUrl, setClientId, setSessionId } = useActionCreators();
  const {router: { location }} = useRouter()

  useEffect(() => {
    if(location !== undefined){
      const queryParams = queryString.parse(location.search);
      const redirectUrl = queryParams['redirectUrl'];
      const clientId = queryParams['clientId'];
      const sessionId = queryParams['sessionId'];

      setRedirectUrl(redirectUrl);
      setClientId(clientId);
      setSessionId(sessionId); 
    }
    else {
      console.log("TODO: location not being found!")
    }
  }, [])

  return (
    <Formik
      onSubmit={login}
      initialValues={{email: '', password: ''}}
      validationSchema={LoginValidationSchema}>
      {({errors, touched, submitForm, isSubmitting, status}) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <div className="content-floating-without-appbar">
            <div className="Login__container">
              <Form>
                <div className="Login__content">
                  <div className="Login__icon-container">
                    <img src={icon} alt="Stroom logo" />
                  </div>
                  <div className="field-container vertical">
                    <div className="horizontal-label-and-validation-container">
                      <label>Email</label>
                      <ErrorMessage
                        name="email"
                        render={msg => (
                          <div className="validation-error">{msg}</div>
                        )}
                      />
                    </div>
                    <Field name="email" autoFocus />
                  </div>
                  <div className="field-container vertical">
                    <div className="horizontal-label-and-validation-container">
                      <label>Password</label>
                      <ErrorMessage
                        name="password"
                        render={msg => (
                          <div className="validation-error">{msg}</div>
                        )}
                      />
                    </div>
                    <Field name="password" type="password" />
                  </div>
                  <div className="Login__status-container">
                    {status ? (
                      <div className="validation-error">{status}</div>
                    ) : (
                      <div/>
                    )}
                    {allowPasswordResets ? (
                      <NavLink
                        className="Login__reset-password"
                        to={'/resetPasswordRequest'}>
                        Reset password?
                      </NavLink>
                    ) : (
                      undefined
                    )}
                  </div>
                  <div className="Login__actions">
                    <Button
                      className="toolbar-button-full primary"
                      disabled={isPristine || hasErrors}
                      type="submit"
                      isLoading={isSubmitting}>
                      Sign in
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
