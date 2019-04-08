/*
 * Copyright 2018 Crown Copyright
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
import { RouteProps, Route } from "react-router-dom";

import AuthenticationRequest from "./AuthenticationRequest";
import useConfig from "../config/useConfig";
import useAuthenticationContext from "./useAuthenticationContext";

const PrivateRoute = ({ render, ...rest }: RouteProps) => {
  const { advertisedUrl, appClientId, authenticationServiceUrl } = useConfig();
  const { idToken } = useAuthenticationContext();

  if (
    !(
      advertisedUrl !== undefined &&
      appClientId !== undefined &&
      authenticationServiceUrl !== undefined
    )
  ) {
    throw new Error(
      `Config Not Correct for Private Routes ${JSON.stringify({
        advertisedUrl,
        appClientId,
        authenticationServiceUrl,
      })}`,
    );
  }

  return (
    <Route
      {...rest}
      render={props =>
        !!idToken ? (
          render && render({ ...props })
        ) : (
          <AuthenticationRequest
            referrer={props.match.url}
            uiUrl={advertisedUrl}
            appClientId={appClientId}
            authenticationServiceUrl={authenticationServiceUrl}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
