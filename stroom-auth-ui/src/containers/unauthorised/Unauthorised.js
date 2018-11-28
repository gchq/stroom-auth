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

import './Unauthorised.css';
import '../Layout.css';

const expiredTokenCopy = "It's likely that your session has timed-out. Would you like to try logging in again?";
const Unauthorised = () => {
  return (
    <div className="content-floating-without-appbar">
      <div className="Unauthorised">
        <h3>Unauthorised!</h3>
        <p>
          I'm afraid you're not authorised to see this page. If you think you
          should be able to please contact an administrator.
        </p>
      </div>
    </div>
  );
};

export default Unauthorised;
