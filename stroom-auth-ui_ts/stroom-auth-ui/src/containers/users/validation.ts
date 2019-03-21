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

import { hasAnyProps } from '../../lang';
import { useApi } from '../../api/authentication';
import { PasswordValidationRequest } from '../../api/authentication/types';

export const NewUserValidationSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
  verifyPassword: Yup.string().required('Required'),
});

export const UserValidationSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
});

type PasswordValidationErrors = {
  password: string;
  oldPassword: string;
  verifyPassword: string;
}

export const validateAsync = (passwordValidationRequest: PasswordValidationRequest) => {
  const { isPasswordValid } = useApi();
  if (passwordValidationRequest.newPassword) {
    isPasswordValid(passwordValidationRequest)
      .then(body => {
        let errors = <PasswordValidationErrors>{};
        // First sort out async password checks
        let passwordErrors = <string[]>[];
        let oldPasswordErrors = <string[]>[];
        if (body.failedOn.length > 0) {
          body.failedOn.forEach((failureType: string) => {
            if (failureType === 'LENGTH') {
              passwordErrors.push('Your new password is not long enough.');
            } else if (failureType === 'COMPLEXITY') {
              passwordErrors.push(
                'Your new password not meet the password complexity requirements.',
              );
            } else if (failureType === 'BAD_OLD_PASSWORD') {
              oldPasswordErrors.push('Your old password is not correct.');
            } else if (failureType === 'REUSE') {
              passwordErrors.push('You may not reuse your old password.');
            } else {
              passwordErrors.push(
                'There is a problem with changing your password, please contact an administrator',
              );
            }
          });
        }
        if (passwordErrors.length > 0) {
          errors.password = passwordErrors.join('\n');
        }

        if (oldPasswordErrors.length > 0) {
          errors.oldPassword = oldPasswordErrors.join('\n');
        }

        // Do password checks
        if (passwordValidationRequest.newPassword !== undefined && passwordValidationRequest.newPassword !== '') {
          if (
            passwordValidationRequest.verifyPassword !== undefined &&
            passwordValidationRequest.verifyPassword !== '' &&
            passwordValidationRequest.newPassword !== passwordValidationRequest.verifyPassword
          ) {
            errors.verifyPassword = 'Passwords do not match';
          }
        }
        if (hasAnyProps(errors)) {
          throw errors;
        }
      });
  }
};

