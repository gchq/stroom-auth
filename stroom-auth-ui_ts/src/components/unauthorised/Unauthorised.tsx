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
import { useEffect, useState } from "react";

import Button from "../Button";
import { useReduxState } from "../../lib/useReduxState";
import "./Unauthorised.css";
import "../../styles/Layout.css";
import useHttpQueryParam from "../../lib/useHttpQueryParam";

const Unauthorised = () => {
  const [isExpiredToken, setIsExpiredToken] = useState(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const { stroomUiUrl } = useReduxState(
    ({
      config: {
        values: { stroomUiUrl }
      }
    }) => ({
      stroomUiUrl
    })
  );
  const reason = useHttpQueryParam("reason");
  useEffect(() => {
    if (reason === "expired_token") {
      setIsExpiredToken(true);
    } else if (reason === "account_locked") {
      setIsAccountLocked(true);
    }
  }, [setIsExpiredToken, setIsAccountLocked]);

  const backToStroomButton = (url: string) => (
    <div className="Unauthorised__actions">
      <Button
        className="toolbar-button-medium primary"
        onClick={() => (window.location.href = url)}
        text="Back to Stroom"
      />
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

export default Unauthorised;
