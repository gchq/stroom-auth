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
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";

import "./EditUser.css";
import BackConfirmation from "../BackConfirmation";
import Button from "../../Button";
import Loader from "../../Loader";
import UserFields from "../UserFields";
import useHttpQueryParam from "../../../lib/useHttpQueryParam";
import useReduxState from "../../../lib/useReduxState";
import useRouter from "../../../lib/useRouter";
import { UserValidationSchema, validateAsync } from "../validation";
import { hasAnyProps } from "../../../lang";
import { useActionCreators, useApi } from "../../../api/users";
import useIdFromPath from '../../../lib/useIdFromPath';

const UserEditForm = () => {
  const { fetchUser, saveChanges } = useApi();
  const { clearUserBeingEdited } = useActionCreators();
  const { history } = useRouter();
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  // const userId = useHttpQueryParam("userId");
  const userId = useIdFromPath("user/");
  const {
    userBeingEdited,
    // isSaving,
    idToken,
    authenticationServiceUrl
  } = useReduxState(
    ({
      user: { userBeingEdited, isSaving, showAlert, alertText },
      authentication: { idToken },
      config: {
        values: { authenticationServiceUrl }
      }
    }) => ({
      userBeingEdited,
      showAlert,
      alertText,
      isSaving,
      idToken,
      authenticationServiceUrl
    })
  );


  useEffect(() => {
    clearUserBeingEdited();
    if (!!userId) fetchUser(userId);
  }, [fetchUser]);

  if (!!userBeingEdited) {
    //TODO: the error page uses redux. Make it use hooks instead.
    let initialValues = {
      ...userBeingEdited,
      email: userBeingEdited.email || "",
      first_name: userBeingEdited.first_name || "",
      last_name: userBeingEdited.last_name || "",
      state: userBeingEdited.state || "enabled",
      password: "",
      verifyPassword: "",
      comments: userBeingEdited.comments || "",
      never_expires: userBeingEdited.never_expires || false,
      force_password_change: userBeingEdited.force_password_change || false
    };


    const handleBack = (isPristine: boolean) => {
      if (isPristine) {
        history.push("/userSearch");
      } else {
        setShowBackConfirmation(true);
      }
    };

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
        validationSchema={UserValidationSchema}
      >
        {({ errors, touched, submitForm, setFieldTouched, setFieldValue }) => {
          const isPristine = !hasAnyProps(touched);
          const hasErrors = hasAnyProps(errors);
          return (
            <Form>
              <div className="header">
                <Button
                  onClick={() => handleBack(isPristine)}
                  className="primary toolbar-button-small"
                  icon="arrow-left"
                  text="Back"
                />
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
                    text="Save"
                  // isLoading={isSaving}
                  />
                  <Button
                    className="toolbar-button-small secondary"
                    icon="times"
                    onClick={() => history.push("/userSearch/")}
                    text="Cancel"
                  />
                </div>
                <BackConfirmation
                  isOpen={showBackConfirmation}
                  onGoBack={() => {
                    setShowBackConfirmation(false);
                    history.push("/userSearch");
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
  }
  else {
    return <Loader message="" />;
  }
};

export default UserEditForm;
