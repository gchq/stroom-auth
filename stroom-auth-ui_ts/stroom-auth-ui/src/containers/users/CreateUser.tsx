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
import { NewUserValidationSchema, validateAsync } from "./validation";
import { hasAnyProps } from "../../lang";
import { useApi , useUsers, User} from "../../api/users";
import useRouter from "../../lib/useRouter";
import { PasswordValidationRequest } from '../../api/authentication/types';


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

const UserCreateForm = (
  {
    // onSubmit,
    // idToken,
    // authenticationServiceUrl,
    // isSaving,
    // push,
  }
) => {
  // const {createUser} = useActionCreators();
  const {createUser} = useUsers();
  // const { createUser } = useApi();
  const { history } = useRouter();
  const { idToken, authenticationServiceUrl/*, isSaving */} = useReduxState(
    ({
      authentication: { idToken },
      user: { isSaving },
      config: {
        values: { authenticationServiceUrl }
      }
    }) => ({ idToken, isSaving, authenticationServiceUrl })
  );
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        const user:User = values;
        createUser(user);
      }}
      validate={values =>{
        const passwordValidationRequest:PasswordValidationRequest = {
          newPassword: values.password,
          verifyPassword: values.verifyPassword,
          email: values.email
        }
        validateAsync(passwordValidationRequest);
      }
      }
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
                // isLoading={isSaving}
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
