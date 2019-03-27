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

import "../Layout.css";
import "./CreateUserForm.css";
import Button from "../Button";
import UserFields from "./UserFields";
import useReduxState from "../../lib/useReduxState";
import useRouter from "../../lib/useRouter";
import { NewUserValidationSchema, validateAsync } from "./validation";
import { PasswordValidationRequest } from "../../api/authentication/types";
import { hasAnyProps } from "../../lang";
import { useUsers, User } from "../../api/users";

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

const UserCreateForm = ({}) => {
  const { createUser } = useUsers();
  const { history } = useRouter();
  const { authenticationServiceUrl, idToken } = useReduxState(
    ({
      config: {
        values: { authenticationServiceUrl }
      },
      authentication: { idToken }
    }) => ({ authenticationServiceUrl, idToken })
  );
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
