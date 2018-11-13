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

import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {compose} from 'recompose';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Formik} from 'formik';

import {AsyncUserSelect} from '../../users';
import './CreateTokenForm.css';
import '../../Layout.css';
import {
  createToken as onSubmit,
  userAutoCompleteChange,
} from '../../../modules/token';
import Button from '../../Button';

const enhance = compose(
  connect(
    ({
      authentication: {idToken},
      token: {matchingAutoCompleteResults, errorMessage, isCreating},
    }) => ({
      idToken,
      matchingAutoCompleteResults,
      errorMessage,
      isCreating,
    }),
    {
      userAutoCompleteChange,
      onSubmit,
    },
  ),
);

const TokenCreateForm = ({onSubmit, isCreating}) => {
  return (
    <div className="CreateTokenForm-card">
      <Formik
        onSubmit={(values, actions) => {
          onSubmit(values.user.label, actions.setSubmitting);
          actions.setSubmitting(false);
        }}
        render={({handleSubmit, setFieldValue, errorMessage}) => (
          <form onSubmit={handleSubmit}>
            <div className="header">
              <NavLink to="/tokens">
                <Button
                  icon="arrow-left"
                  className="primary toolbar-button-small">
                  Back
                </Button>
              </NavLink>
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
                    {' '}
                    {errorMessage}
                  </div>
                </div>
              </div>
            </div>
            <div className="footer">
              <Button
                className="toolbar-button-small primary"
                icon="plus"
                type="submit"
                isLoading={isCreating}>
                Create
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default enhance(TokenCreateForm);
