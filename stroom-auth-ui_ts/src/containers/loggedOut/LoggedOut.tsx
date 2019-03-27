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
import { useEffect } from "react";

import { useActionCreators } from "../../api/authentication";
import Button from "../Button";
import "./LoggedOut.css";
import "../Layout.css";
import useReduxState from "../../lib/useReduxState";

const LoggedOut = () => {
  const { stroomUiUrl } = useReduxState(
    ({
      config: {
        values: { stroomUiUrl }
      }
    }) => ({ stroomUiUrl })
  );
  const { changeLoggedInUser, deleteToken } = useActionCreators();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    changeLoggedInUser(""), deleteToken();
  }, []);

  return (
    <div className="content-floating-without-appbar">
      <div className="LoggedOut">
        <h3>You have been logged out</h3>
        <div className="LoggedOut__actions">
          <Button
            className="toolbar-button-medium primary"
            onClick={() => (window.location.href = stroomUiUrl)}
            text="Return to Stroom"
          />
        </div>
      </div>
    </div>
  );
};

export default LoggedOut;
