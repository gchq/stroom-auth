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

import React from 'react';
import * as moment from 'moment';

//const SERVER_DATE_TIME_FORMAT = 'ddd MMM Do YYYY, HH:mm:ss';
const DISPLAY_DATE_TIME_FORMAT = 'MMMM Do YYYY, h:mm:ss a';       

export const UpdatedCopy = ({updatedBy, updatedOn}) => {
  if (updatedOn !== undefined && updatedBy !== 'Never been updated') {
    updatedOn = moment(updatedOn);
      //updatedOn = moment(updatedOn, SERVER_DATE_TIME_FORMAT);
    return (
      <div>
        <div className="copy">
          This user account was <strong>updated</strong> {updatedOn.from()}, at{' '}
          {updatedOn.format(DISPLAY_DATE_TIME_FORMAT)}.
        </div>
        <div className="copy">
          It was <strong>updated by</strong> <em>{updatedBy}</em>.
        </div>
      </div>
    );
  } else {
    return (
      <div className="copy">
        This user account has never been <strong>updated</strong>.
      </div>
    );
  }
};

export const LoginStatsCopy = ({lastLogin, loginCount}) => {
  if (lastLogin !== undefined) {
    lastLogin = moment(lastLogin);
      //lastLogin = moment(lastLogin, SERVER_DATE_TIME_FORMAT);
    const loginStatsCopy = (
      <div>
        <div className="copy">
          Last login: {lastLogin.fromNow()}, at{' '}
          {lastLogin.format(DISPLAY_DATE_TIME_FORMAT)}{' '}
        </div>
        <div className="copy">Total logins: {loginCount}</div>
      </div>
    );
    return loginStatsCopy;
  } else {
    return <div className="copy">This user has never logged in.</div>;
  }
};

export const CreatedCopy = ({createdBy, createdOn}) => {
  if (createdOn !== undefined) {
    createdOn = moment(createdOn);
      //createdOn = moment(createdOn, SERVER_DATE_TIME_FORMAT);
    return (
      <div>
        <div className="copy">
          This user account was <strong>created</strong> {createdOn.from()}, at{' '}
          {createdOn.format(DISPLAY_DATE_TIME_FORMAT)}.
        </div>
        <div className="copy">
          It was <strong>created by</strong> <em>{createdBy}</em>.
        </div>
      </div>
    );
  }
};
