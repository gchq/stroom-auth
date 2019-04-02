/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use  file except in compliance with the License.
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
import { Formik } from "formik";

import { AsyncUserSelect } from "../users";
import "src/styles/form.css";
import "./CreateTokenForm.css";
import "src/styles/Layout.css";
import Button from "../Button";
import { useTokens } from "src/api/tokens";
import useReduxState from "src/lib/useReduxState";
import useRouter from "src/lib/useRouter";

type DropDownValues = {
  label: string;
  value: number;
};

const TokenCreateForm = () => {
  const { history } = useRouter();
  const { errorMessage } = useReduxState(
    ({ token: { errorMessage, isCreating } }) => ({ isCreating, errorMessage })
  );
  const { createToken } = useTokens();

  return (
    <div className="CreateTokenForm-card">
      <Formik
        initialValues={
          { user: { label: "", value: -1 } } as { user: DropDownValues }
        }
        onSubmit={(values, actions) => {
          createToken(values.user.label);
          actions.setSubmitting(false);
        }}
        render={({ handleSubmit, setFieldValue, values }) => {
          const submitIsDisabled = values.user === undefined;
          return (
            <form onSubmit={handleSubmit}>
              <div className="header">
                <Button
                  icon="arrow-left"
                  className="primary toolbar-button-small"
                  onClick={() => history.push("/tokens")}
                  text="Back"
                />
              </div>
              <div className="container">
                <div className="section">
                  <div className="section__title">
                    <h3>User's email</h3>
                  </div>
                  <div className="section__fields">
                    <div className="section__fields__row">
                      <div className="field-container">
                        <div className="label-container">
                          <label />
                        </div>
                        <AsyncUserSelect onChange={setFieldValue} />
                      </div>
                    </div>
                    <div className="CreateTokenForm-errorMessage">
                      {" "}
                      {errorMessage}
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer">
                <Button
                  className="toolbar-button-small primary"
                  disabled={submitIsDisabled}
                  icon="plus"
                  type="submit"
                  text="Create"
                />
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default TokenCreateForm;
