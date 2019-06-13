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
import {Route, withRouter, Switch, BrowserRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import './App.css';
import Login from '../../containers/login';
import LoggedOut from '../../containers/loggedOut';
import {
  UserCreate,
  UserEdit,
  UserSearch,
  NewUser,
} from '../../containers/users';
import {TokenCreate, TokenSearch, TokenEdit} from '../../containers/tokens';
import PathNotFound from '../../containers/pathNotFound';
import {
  ResetPassword,
  ChangePassword,
  ConfirmPasswordResetEmail,
  ResetPasswordRequest,
} from '../../containers/password';
import Unauthorised from '../../containers/unauthorised';
import AuthenticationRequest from '../../startup/authentication/AuthenticationRequest';
import HandleAuthenticationResponse from '../../startup/authentication/HandleAuthenticationResponse';

const enhance = compose(
  withRouter,
  connect(
    ({
      authentication: {idToken},
      config: {
        advertisedUrl,
        appClientId,
        authenticationServiceUrl,
        authorisationServiceUrl,
      },
    }) => ({
      idToken,
      appClientId,
      advertisedUrl,
      authenticationServiceUrl,
      authorisationServiceUrl,
    }),
    {},
  ),
);

const App = ({
  idToken,
  advertisedUrl,
  appClientId,
  authenticationServiceUrl,
  authorisationServiceUrl,
}) => {
  const isLoggedIn = !!idToken;
  return (
    <div className="App">
      <main className="main">
        <div>
          <BrowserRouter basename={'/'} />
          <Switch>
            {/* Authentication routes */}
            <Route
              exact
              path={'/s/handleAuthentication'}
              render={() => (
                <HandleAuthenticationResponse
                  authenticationServiceUrl={authenticationServiceUrl}
                  authorisationServiceUrl={authorisationServiceUrl}
                />
              )}
            />
            <Route
              exact
              path={'/s/handleAuthenticationResponse'}
              render={() => (
                <HandleAuthenticationResponse
                  authenticationServiceUrl={authenticationServiceUrl}
                  authorisationServiceUrl={authorisationServiceUrl}
                />
              )}
            />

            {/* Routes not requiring authentication */}
            <Route exact path={'/s/login'} component={Login} />
            <Route exact path={'/s/logout'} component={LoggedOut} />
            <Route exact path={'/s/loggedOut'} component={LoggedOut} />
            <Route exact path={'/s/newUser'} component={NewUser} />
            <Route exact path={'/s/resetPassword'} component={ResetPassword} />
            <Route exact path={'/s/resetpassword'} component={ResetPassword} />
            <Route exact path={'/s/changepassword'} component={ChangePassword} />
            <Route
              exact
              path={'/s/confirmPasswordResetEmail'}
              component={ConfirmPasswordResetEmail}
            />
            <Route
              exact
              path={'/s/resetPasswordRequest'}
              component={ResetPasswordRequest}
            />
            <Route exact path={'/s/Unauthorised'} component={Unauthorised} />

            {/* Routes requiring authentication */}
            <Route
              exact
              path={'/s/users'}
              render={() =>
                isLoggedIn ? (
                  <UserSearch />
                ) : (
                  <AuthenticationRequest
                    referrer="/s/users"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={
                      authenticationServiceUrl
                    }
                  />
                )
              }
            />

            <Route
              exact
              path={'/s/user'}
              render={() =>
                isLoggedIn ? (
                  <UserCreate />
                ) : (
                  <AuthenticationRequest
                    referrer="/s/user"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={
                      authenticationServiceUrl
                    }
                  />
                )
              }
            />

            <Route
              exact
              path={'/s/user/:userId'}
              render={route =>
                isLoggedIn ? (
                  <UserEdit />
                ) : (
                  <AuthenticationRequest
                    referrer={route.location.pathname}
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={
                      authenticationServiceUrl
                    }
                  />
                )
              }
            />

            <Route
              exact
              path={'/s/tokens'}
              render={() =>
                isLoggedIn ? (
                  <TokenSearch />
                ) : (
                  <AuthenticationRequest
                    referrer="/s/tokens"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={
                      authenticationServiceUrl
                    }
                  />
                )
              }
            />

            <Route
              exact
              path={'/s/token/newApiToken'}
              render={() =>
                isLoggedIn ? (
                  <TokenCreate />
                ) : (
                  <AuthenticationRequest
                    referrer="/s/token/newApiToken"
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={
                      authenticationServiceUrl
                    }
                  />
                )
              }
            />

            <Route
              exact
              path={'/s/token/:tokenId'}
              render={route =>
                isLoggedIn ? (
                  <TokenEdit />
                ) : (
                  <AuthenticationRequest
                    referrer={route.location.pathname}
                    uiUrl={advertisedUrl}
                    appClientId={appClientId}
                    authenticationServiceUrl={
                      authenticationServiceUrl
                    }
                  />
                )
              }
            />

            {/* Fall through to 404 */}
            <Route component={PathNotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
};

//App.contextTypes = {
//  store: PropTypes.object,
//  router: PropTypes.shape({
//    history: object.isRequired,
//  }),
//};
//
//App.propTypes = {
//  idToken: PropTypes.string.isRequired,
//};
//
//const mapStateToProps = state => ({
//  idToken: state.authentication.idToken,
//  advertisedUrl: state.config.advertisedUrl,
//  appClientId: state.config.appClientId,
//  authenticationServiceUrl: state.config.authenticationServiceUrl,
//  authorisationServiceUrl: state.config.authorisationServiceUrl,
//});

//const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
//
//export default withRouter(
//  connect(
//    mapStateToProps,
//    mapDispatchToProps,
//  )(App),
//);

export default enhance(App);
