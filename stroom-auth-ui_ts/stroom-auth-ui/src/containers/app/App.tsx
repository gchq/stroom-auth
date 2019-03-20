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
import { Route, Switch } from "react-router-dom";

import "./App.css";
import Login from "../../containers/login";
import LoggedOut from "../../containers/loggedOut";
import {
  UserCreate,
  UserEdit,
  UserSearch,
  NewUser
} from "../../containers/users";
import { TokenCreate, TokenSearch, TokenEdit } from "../../containers/tokens";
import {PathNotFound }from "../../containers/pathNotFound";
import {
  ResetPassword,
  ChangePassword,
  ConfirmPasswordResetEmail,
  ResetPasswordRequest
} from "../../containers/password";
import Unauthorised from "../../containers/unauthorised";
import AuthenticationRequest from "../../startup/authentication/AuthenticationRequest";
import HandleAuthenticationResponse from "../../startup/authentication/HandleAuthenticationResponse";
import useReduxState from "../../lib/useReduxState";
import Loader from "../../components/Loader";
import useConfig from "../../startup/config/useConfig";
import ErrorPage from "../../components/ErrorPage";
import { useApi as useUserApi, useUsers } from "../../api/users";

const App = () => {
  const config = useConfig();
  const idToken = useReduxState(({ authentication: { idToken } }) => idToken);

  const isLoggedIn = !!idToken;
  const { fetchCurrentUser } = useUsers();

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchCurrentUser();
    }
  }, [isLoggedIn, fetchCurrentUser]);

  const {
    isReady,
    values: {
      authenticationServiceUrl,
      authorisationServiceUrl,
      advertisedUrl,
      appClientId
    }
  } = config;

  if (
    !(
      isReady &&
      !!advertisedUrl &&
      !!appClientId &&
      !!authenticationServiceUrl &&
      !!authorisationServiceUrl
    )
  ) {
    return <Loader message="Waiting for config" />;
  }

  return (
    <div className="App">
      <main className="main">
        <div>
          {/* <BrowserRouter basename={'/'} /> */}
          <Switch>
            {/* Authentication routes */}
            <Route
              exact={true}
              path={"/handleAuthentication"}
              render={() => (
                <HandleAuthenticationResponse
                  authenticationServiceUrl={authenticationServiceUrl}
                  authorisationServiceUrl={authorisationServiceUrl}
                />
              )}
            />
            <Route
              exact
              path={"/handleAuthenticationResponse"}
              render={() => (
                <HandleAuthenticationResponse
                  authenticationServiceUrl={authenticationServiceUrl}
                  authorisationServiceUrl={authorisationServiceUrl}
                />
              )}
            />

            {/* Routes not requiring authentication */}
            <Route exact path={"/login"} component={Login} />
            <Route exact path={"/logout"} component={LoggedOut} />
            <Route exact path={"/loggedOut"} component={LoggedOut} />
            <Route exact path={"/newUser"} component={NewUser} />
            <Route exact path={"/resetPassword"} component={ResetPassword} />
            <Route exact path={"/resetpassword"} component={ResetPassword} />
            <Route exact path={"/changepassword"} component={ChangePassword} />
            <Route
              exact
              path={"/confirmPasswordResetEmail"}
              component={ConfirmPasswordResetEmail}
            />
            <Route
              exact
              path={"/resetPasswordRequest"}
              component={ResetPasswordRequest}
            />
            <Route exact path={"/Unauthorised"} component={Unauthorised} />

            {/* Routes requiring authentication */}
            <Route
              exact
              path={"/userSearch"}
              render={() =>
                isLoggedIn ? (
                  <UserSearch />
                ) : (
                  <AuthenticationRequest
                    referrer="/userSearch"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={authenticationServiceUrl}
                  />
                )
              }
            />

            <Route
              exact
              path={"/user"}
              render={() =>
                isLoggedIn ? (
                  <UserCreate />
                ) : (
                  <AuthenticationRequest
                    referrer="/user"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={authenticationServiceUrl}
                  />
                )
              }
            />

            <Route
              exact
              path={"/user/:userId"}
              render={route =>
                isLoggedIn ? (
                  <UserEdit />
                ) : (
                  <AuthenticationRequest
                    referrer={route.location.pathname}
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={authenticationServiceUrl}
                  />
                )
              }
            />

            <Route
              exact
              path={"/tokens"}
              render={() =>
                isLoggedIn ? (
                  <TokenSearch />
                ) : (
                  <AuthenticationRequest
                    referrer="/tokens"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={authenticationServiceUrl}
                  />
                )
              }
            />

            <Route
              exact
              path={"/token/newApiToken"}
              render={() =>
                isLoggedIn ? (
                  <TokenCreate />
                ) : (
                  <AuthenticationRequest
                    referrer="/token/newApiToken"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={authenticationServiceUrl}
                  />
                )
              }
            />

            <Route
              exact
              path={"/token/:tokenId"}
              render={route =>
                isLoggedIn ? (
                  <TokenEdit />
                ) : (
                  <AuthenticationRequest
                    referrer={route.location.pathname}
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={authenticationServiceUrl}
                  />
                )
              }
            />

            <Route exact path={"/error"} component={ErrorPage} />

            {/* Fall through to 404-ish */}
            <Route component={PathNotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
};

export default App;
