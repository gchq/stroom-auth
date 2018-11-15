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

import * as Yup from 'yup';

const UserValidationSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
});

const validateAsync = (values, idToken, url) => {
  return fetch(`${url}/isPasswordValid`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + idToken,
    },
    method: 'post',
    mode: 'cors',
    body: JSON.stringify({
      email: values.email,
      newPassword: values.password,
    }),
  })
    .then(response => response.json())
    .then(body => {
      let errors = {};

      // First sort out async password checks
      let passwordErrors = [];
      if (body.failedOn.length > 0) {
        body.failedOn.map(failureType => {
          if (failureType === 'LENGTH') {
            passwordErrors.push('Not long enough');
          } else if (failureType === 'COMPLEXITY') {
            passwordErrors.push('Does not meet complexity requirements');
          }
        });
      }
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors.join('\n');
      }

      // Do password checks
      if (
        values.password !== undefined &&
        values.password !== ''
      ) {
        if (
          values.verifyPassword !== undefined &&
          values.verifyPassword !== '' &&
          values.password !== values.verifyPassword
        ) {
          errors.verifyPassword = 'Passwords do not match';
        }
      }

      throw errors;
    });
};

export {UserValidationSchema, validateAsync};
