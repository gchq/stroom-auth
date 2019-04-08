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
import { Formik, Form } from "formik";

import "src/styles/Layout.css";
import Button from "src/components/Button";
import useRouter from "src/lib/useRouter";
import { PasswordValidationRequest } from "src/api/authentication/types";
import { hasAnyProps } from "src/lib/lang";

import "./CreateUserForm.css";
import UserFields from "./UserFields";
import { NewUserValidationSchema, validateAsync } from "../validation";
import { User } from "../types";
import { useUsers } from "../api";
import { useConfig } from 'src/startup/config';
import { useAuthenticationContext } from 'src/startup/authentication';

// If we don't pass initialValues to Formik then they won't be controlled
// and we'll get console errors when they're used.
const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  state: "enabled",
  password: "",
  verifyPassword: "",
  comments: "",
  force_password_change: true
};

const UserCreateForm = ({ }) => {
  const { createUser } = useUsers();
  const { history } = useRouter();
  const { authenticationServiceUrl } = useConfig();
  if (!authenticationServiceUrl) throw Error("Configuration not ready or misconfigured!");
  const { idToken } = useAuthenticationContext();
  if (!idToken) throw Error("Not authenticated") //FIXME: handle this. Show unauthorised page probably.

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        const user: User = values;
        createUser(user);
      }}
      validate={values => {
        const passwordValidationRequest: PasswordValidationRequest = {
          newPassword: values.password,
          verifyPassword: values.verifyPassword,
          email: values.email
        };
        return validateAsync(
          passwordValidationRequest,
          idToken,
          authenticationServiceUrl
        );
      }}
      validationSchema={NewUserValidationSchema}
    >
      {({ errors, touched, setFieldTouched, setFieldValue }) => {
        const isPristine = !hasAnyProps(touched);
        const hasErrors = hasAnyProps(errors);
        return (
          <Form>
            <div className="header">
              <Button
                className="primary toolbar-button-small"
                icon="arrow-left"
                onClick={() => history.push("/userSearch")}
                text="Back"
              />
            </div>
            <UserFields
              showCalculatedFields={false}
              errors={errors}
              touched={touched}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <div className="footer">
              <Button
                className="toolbar-button-small primary"
                disabled={isPristine || hasErrors}
                type="submit"
                icon="save"
                text="Save"
              />
              <Button
                className="toolbar-button-small secondary"
                icon="times"
                onClick={() => history.push("/userSearch")}
                text="Cancel"
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UserCreateForm;
