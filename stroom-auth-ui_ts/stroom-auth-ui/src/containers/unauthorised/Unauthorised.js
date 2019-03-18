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

import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { compose, withState, lifecycle } from "recompose";
import { withRouter } from "react-router";

import Button from "../Button";
import { useReduxState } from "../../lib/useReduxState";
import { useActionCreators } from "../../api/authentication";
import useRouter from "../../lib/useRouter";
import "./Unauthorised.css";
import "../Layout.css";

const Unauthorised = () => {
  const [isExpiredToken, setIsExpiredToken] = useState(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);

  const { stroomUiUrl } = useReduxState(({ config: { stroomUiUrl } }) => ({
    stroomUi
  }));

  useEffect(() => {
    const query = queryString.parse(this.props.location.search);
    if (query.reason === "expired_token") {
      this.props.setIsExpiredToken(true);
    } else if (query.reason === "account_locked") {
      this.props.setIsAccountLocked(true);
    }
  }, []);

  const backToStroomButton = url => (
    <div className="Unauthorised__actions">
      <Button
        className="toolbar-button-medium primary"
        onClick={() => (window.location.href = url)}
      >
        Back to Stroom
      </Button>
    </div>
  );

  const expiredTokenMessage = (
    <React.Fragment>
      <p>
        It's likely that your session has timed-out. Would you like to try
        logging in again?
      </p>
      {backToStroomButton(stroomUiUrl)}
    </React.Fragment>
  );

  const accountLockedMessage = (
    <React.Fragment>
      <p>
        The account associated with your certificate has been locked. Please
        contact an administrator.
      </p>
      <p>
        If you have a username/password account then you might want to try
        logging in.
      </p>
      {backToStroomButton(`${stroomUiUrl}?prompt=login`)}
    </React.Fragment>
  );

  const standardMessage = (
    <React.Fragment>
      <p>
        I'm afraid you're not authorised to see this page. If you think you
        should be able to please contact an administrator.
      </p>
      {backToStroomButton(stroomUiUrl)}
    </React.Fragment>
  );

  return (
    <div className="content-floating-without-appbar">
      <div className="Unauthorised">
        <h3>Unauthorised!</h3>
        {isExpiredToken ? expiredTokenMessage : undefined}
        {isAccountLocked ? accountLockedMessage : undefined}
        {!isExpiredToken && !isAccountLocked ? standardMessage : undefined}
      </div>
    </div>
  );
};

export default enhance(Unauthorised);
