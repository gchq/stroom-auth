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

import Button from "src/components/Button";
import Loader from "src/components/Loader";
import useIdFromPath from "src/lib/useIdFromPath";
import useRouter from "src/lib/useRouter";
import { PasswordValidationRequest } from "src/api/authentication/types";
import { hasAnyProps } from "src/lib/lang";

import "./EditUser.css";
import BackConfirmation from "../BackConfirmation";
import UserFields from "./UserFields";
import { UserValidationSchema, validateAsync } from "../validation";
import { useUsers } from "../api";
import { useConfig } from 'src/startup/config';
import { useAuthenticationContext } from 'src/startup/Authentication';

const UserEditForm = () => {
  const { updateUser, fetchUser, user } = useUsers();
  const { history } = useRouter();
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const userId = useIdFromPath("user/");
  const { authenticationServiceUrl } = useConfig();
  const { idToken } = useAuthenticationContext();
  if (!authenticationServiceUrl || !idToken) {
    throw Error("Config not ready or misconfigured!");
  }
  useEffect(() => {
    if (!!userId && !user) fetchUser(userId);
  }, [fetchUser]);

  if (!!user) {
    let initialValues = {
      id: user.id || "",
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      state: user.state || "enabled",
      password: "",
      verifyPassword: "",
      comments: user.comments || "",
      never_expires: user.never_expires || false,
      force_password_change: user.force_password_change || false
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
          //TODO: Add a form-to-user mapping function here
          updateUser(values);
        }}
        initialValues={initialValues}
        validateOnBlur
        validate={values => {
          const passwordValidationRequest: PasswordValidationRequest = {
            newPassword: values.password,
            verifyPassword: values.verifyPassword,
            email: values.email
          };
          validateAsync(
            passwordValidationRequest,
            idToken,
            authenticationServiceUrl
          );
        }}
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
                  userBeingEdited={user}
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
  } else {
    return <Loader message="" />;
  }
};

export default UserEditForm;
