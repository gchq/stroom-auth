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
import {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Formik, Form} from 'formik';
import PropTypes, {object} from 'prop-types';
// import {
//   withProps,
//   branch,
//   lifecycle,
//   compose,
//   renderComponent,
//   withState,
//   withHandlers,
// } from 'recompose';
import BackConfirmation from '../BackConfirmation';
import {push} from 'react-router-redux';

import './EditUser.css';
import UserFields from '../UserFields';
// import {
//   saveChanges as onSubmit,
//   toggleAlertVisibility,
//   fetchUser,
//   clearUserBeingEdited,
// } from '../../../modules/user';
import {hasAnyProps} from '../../../lang';
import {UserValidationSchema, validateAsync} from '../validation';
import Button from '../../Button';
import Loader from '../../Loader';
import {useActionCreators, useApi} from '../../../api/users';
import useReduxState from "../../../lib/useReduxState";

import useRouter from "../../../lib/useRouter";
// const enhance = compose(
//   withRouter,
  // connect(
  //   ({
  //     user: {userBeingEdited, isSaving, showAlert, alertText},
  //     authentication: {idToken},
  //     config: {authenticationServiceUrl},
  //   }) => ({
  //     userBeingEdited,
  //     showAlert,
  //     alertText,
  //     isSaving,
  //     idToken,
  //     authenticationServiceUrl,
  //   }),
  //   {
  //     // onSubmit,
  //     // clearUserBeingEdited,
  //     // fetchUser,
  //     // toggleAlertVisibility,
  //     push,
  //   },
  // ),
  // lifecycle({
  //   componentDidMount() {
  //     const userId = this.props.match.params.userId;
  //     this.props.clearUserBeingEdited();
  //     this.props.fetchUser(userId);
  //   },
  // }),
  // branch(
  //   ({userBeingEdited}) => !userBeingEdited,
  //   renderComponent(() => <Loader />),
  // ),
  // withState('showBackConfirmation', 'setShowBackConfirmation', false),
  // withHandlers({
  //   handleBack: ({setShowBackConfirmation, push}) => isPristine => {
  //     if (isPristine) {
  //       push('/userSearch');
  //     } else {
  //       setShowBackConfirmation(true);
  //     }
  //   },
  // }),
  // withProps(({userBeingEdited}) => {
  //   // Formik needs every field to have an initialValue, otherwise
  //   // the field won't be controlled and we'll get console errors.
  //   return {
  //     initialValues: {
  //       ...userBeingEdited,
  //       email: userBeingEdited.email || '',
  //       first_name: userBeingEdited.first_name || '',
  //       last_name: userBeingEdited.last_name || '',
  //       state: userBeingEdited.state || 'enabled',
  //       password: '',
  //       verifyPassword: '',
  //       comments: userBeingEdited.comments || '',
  //       never_expires: userBeingEdited.never_expires || false,
  //       force_password_change: userBeingEdited.force_password_change || false,
  //     },
  //   };
  // }),
// );

const UserEditForm = ({
  // userBeingEdited,
  // initialValues,
  // idToken,
  // isSaving,
  // authenticationServiceUrl,
  // onSubmit,
  // handleBack,
  // showBackConfirmation,
  // setShowBackConfirmation,
  // push,
  match
}) => {

  const {fetchUser, saveChanges} = useApi();
  const {toggleAlertVisibility,clearUserBeingEdited} = useActionCreators();
  const {history} = useRouter();
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const {userBeingEdited,
    showAlert,
    alertText,
    isSaving,
    idToken,
    authenticationServiceUrl} = useReduxState(
  ({
    user: {userBeingEdited, isSaving, showAlert, alertText},
    authentication: {idToken},
    config: {values:{authenticationServiceUrl}},
  }) => ({userBeingEdited,
    showAlert,
    alertText,
    isSaving,
    idToken,
    authenticationServiceUrl,})
     );

  let initialValues = {
    ...userBeingEdited,
    email: userBeingEdited.email || '',
    first_name: userBeingEdited.first_name || '',
    last_name: userBeingEdited.last_name || '',
    state: userBeingEdited.state || 'enabled',
    password: '',
    verifyPassword: '',
    comments: userBeingEdited.comments || '',
    never_expires: userBeingEdited.never_expires || false,
    force_password_change: userBeingEdited.force_password_change || false 
  };

  useEffect(() => {
    const userId = match.params.userId;
    clearUserBeingEdited();
    fetchUser(userId)
  }, [])


  const handleBack = (isPristine:boolean) => {
    if (isPristine) {
      history.push('/userSearch');
    } else {
      setShowBackConfirmation(true);
    }
  }
  

  if(!userBeingEdited) {
    return (<Loader message=""/>)
  }
  return (

    <Formik
      onSubmit={(values, actions) => {
        saveChanges(values);
      }}
      initialValues={initialValues}
     validateOnBlur 
      validate={values =>
        validateAsync(values, idToken, authenticationServiceUrl)
      }
      validationSchema={UserValidationSchema}>
      {({errors, touched, submitForm, setFieldTouched, setFieldValue}) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <Form>
            <div className="header">
              <Button
                onClick={() => handleBack(isPristine)}
                className="primary toolbar-button-small"
                icon="arrow-left">
                Back
              </Button>
            </div>
            <div>
              <UserFields
                showCalculatedFields
                userBeingEdited={userBeingEdited}
                errors={errors}
                touched={touched}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
              />
              <div className="footer">
                <Button
                  type="submit"
                  className="toolbar-button-small primary"
                  disabled={isPristine || hasErrors}
                  icon="save"
                  isLoading={isSaving}>
                  Save
                </Button>
                <Button
                  className="toolbar-button-small secondary"
                  icon="times"
                  onClick={() => history.push('/userSearch/')}>
                  Cancel
                </Button>
              </div>
              <BackConfirmation
                isOpen={showBackConfirmation}
                onGoBack={() => {
                  setShowBackConfirmation(false);
                  history.push('/userSearch');
                }}
                errors={errors}
                onSaveAndGoBack={submitForm}
                onContinueEditing={() => setShowBackConfirmation(false)}
              />
            </div>
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

export default UserEditForm;
