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

import React, { Component } from 'react'
import PropTypes, { object } from 'prop-types'
import { Route, withRouter, Switch, BrowserRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import './App.css'
import Login from '../../containers/login'
import Logout from '../../containers/logout'
import LoggedOut from '../../containers/loggedOut'
import { UserCreate, UserEdit, UserSearch, NewUser } from '../../containers/users'
import { TokenCreate, TokenSearch, TokenEdit } from '../../containers/tokens'
import PathNotFound from '../../containers/pathNotFound'
import {ResetPassword, ChangePassword, ConfirmPasswordResetEmail, ResetPasswordRequest} from '../../containers/password'
import Unauthorised from '../../containers/unauthorised'
import AuthenticationRequest from '../../startup/authentication/AuthenticationRequest'
import HandleAuthenticationResponse from '../../startup/authentication/HandleAuthenticationResponse'

class App extends Component {
  isLoggedIn () {
    return !!this.props.idToken
  }

  render () {
    return (
      <div className='App'>
        <main className='main'>
          <div >
            <BrowserRouter basename={'/'} />
            <Switch>
              {/* Authentication routes */}
              <Route exact path={'/handleAuthentication'} 
                render={() => (<HandleAuthenticationResponse
                authenticationServiceUrl={this.props.authenticationServiceUrl}
                authorisationServiceUrl={this.props.authorisationServiceUrl} />
              )} />
              <Route exact path={'/handleAuthenticationResponse'} 
                render={() => (<HandleAuthenticationResponse
                authenticationServiceUrl={this.props.authenticationServiceUrl}
                authorisationServiceUrl={this.props.authorisationServiceUrl} />
              )} />

              {/* Routes not requiring authentication */}
              <Route exact path={'/login'} component={Login} />
              <Route exact path={'/logout'} component={Logout} />
              <Route exact path={'/loggedOut'} component={LoggedOut} />
              <Route exact path={'/newUser'} component={NewUser} />
              <Route exact path={'/resetPassword'} component={ResetPassword} />
              <Route exact path={'/resetpassword'} component={ResetPassword} />
              <Route exact path={'/changepassword'} component={ChangePassword} />
              <Route exact path={'/confirmPasswordResetEmail'} component={ConfirmPasswordResetEmail} />
              <Route exact path={'/resetPasswordRequest'} component={ResetPasswordRequest} />
              <Route exact path={'/Unauthorised'} component={Unauthorised} />

              {/* Routes requiring authentication */}
              <Route exact path={'/userSearch'} render={() => (
                this.isLoggedIn() ? <UserSearch /> : <AuthenticationRequest
                  referrer='/userSearch'
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={'/user'} render={() => (
                this.isLoggedIn() ? <UserCreate /> : <AuthenticationRequest
                  referrer='/user'
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={'/user/:userId'} render={(route) => (
                this.isLoggedIn() ? <UserEdit /> : <AuthenticationRequest
                  referrer={route.location.pathname}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={'/tokens'} render={() => (
                  this.isLoggedIn() ? <TokenSearch /> : <AuthenticationRequest
                    referrer='/tokens'
                    uiUrl={this.props.advertisedUrl}
                    appClientId={this.props.appClientId}
                    authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={'/token/newApiToken'} render={() => (
                  this.isLoggedIn() ? <TokenCreate /> : <AuthenticationRequest
                    referrer='/token/newApiToken'
                    uiUrl={this.props.advertisedUrl}
                    appClientId={this.props.appClientId}
                    authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={'/token/:tokenId'} render={(route) => (
                this.isLoggedIn() ? <TokenEdit /> : <AuthenticationRequest
                  referrer={route.location.pathname}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              {/* Fall through to 404 */}
              <Route component={PathNotFound} />

            </Switch>
          </div>
        </main>
      </div>
    )
  }
}

App.contextTypes = {
  store: PropTypes.object,
  router: PropTypes.shape({
    history: object.isRequired
  })
}

App.propTypes = {
  idToken: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  idToken: state.authentication.idToken,
  advertisedUrl: state.config.advertisedUrl,
  appClientId: state.config.appClientId,
  authenticationServiceUrl: state.config.authenticationServiceUrl,
  authorisationServiceUrl: state.config.authorisationServiceUrl
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
