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
import {Route, withRouter, Switch, BrowserRouter} from 'react-router-dom'
import { Redirect } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import './App.css'
import Login from '../../containers/login'
import Logout from '../../containers/logout'
import LoggedOut from '../../containers/loggedOut'
import {UserCreate, UserEdit, UserSearch} from '../../containers/user'
import {TokenCreate, TokenSearch, TokenEdit} from '../../containers/token'
import NewUser from '../../containers/newUser'
import PathNotFound from '../../containers/pathNotFound'
import ResetPassword from '../../containers/resetPassword'
import ChangePassword from '../../containers/changePassword'
import ResetPasswordRequest from '../../containers/resetPasswordRequest'
import ConfirmPasswordResetEmail from '../../containers/confirmPasswordResetEmail'
import Home from '../../containers/home'
import Unauthorised from '../../containers/unauthorised'
import { AuthenticationRequest, HandleAuthenticationResponse } from 'stroom-js'
import { handleSessionTimeout } from '../../modules/login'

class App extends Component {
  isLoggedIn () {
    return !!this.props.idToken
  }

  render () {
    const { basePath } = this.props
    return (
      <div className='App'>
        <main className='main'>
          <div >
            <BrowserRouter basename={`/${basePath}`} />
            <Switch>
              {/* Authentication routes */}
              <Route exact path={`/${basePath}/handleAuthentication`} render={() => (<HandleAuthenticationResponse
                authenticationServiceUrl={this.props.authenticationServiceUrl}
                authorisationServiceUrl={this.props.authorisationServiceUrl} />
              )} />
              <Route exact path={`/${basePath}/handleAuthenticationResponse`} render={() => (<HandleAuthenticationResponse
                authenticationServiceUrl={this.props.authenticationServiceUrl}
                authorisationServiceUrl={this.props.authorisationServiceUrl} />
              )} />

              {/* Routes not requiring authentication */}
              <Route exact path={`/${basePath}/login`} component={Login} />
              <Route exact path={`/${basePath}/logout`} component={Logout} />
              <Route exact path={`/${basePath}/loggedOut`} component={LoggedOut} />
              <Route exact path={`/${basePath}/newUser`} component={NewUser} />
              <Route exact path={`/${basePath}/resetPassword`} component={ResetPassword} />
              <Route exact path={`/${basePath}/confirmPasswordResetEmail`} component={ConfirmPasswordResetEmail} />
              <Route exact path={`/${basePath}/resetPasswordRequest`} component={ResetPasswordRequest} />
              <Route exact path={`/${basePath}/Unauthorised`} component={Unauthorised} />

              {/* Routes requiring authentication */}
              <Route exact path={'/'} render={() => (
                <Redirect to={`/${basePath}`} />
              )} />
              <Route exact path={`/${basePath}`} render={() => (
                <Redirect to={`/${basePath}/home`} />
              )} />
              <Route exact path={`/${basePath}/home`} render={() => (
                this.isLoggedIn() ? <Home /> : <AuthenticationRequest
                  referrer={`/${basePath}`}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={`/${basePath}/userSearch`} render={() => (
                this.isLoggedIn() ? <UserSearch /> : <AuthenticationRequest
                  referrer={`/${basePath}/userSearch`}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={`/${basePath}/changepassword`} render={(route) => (
                this.isLoggedIn() ? <ChangePassword /> : <AuthenticationRequest
                  referrer={route.location.pathname}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={`/${basePath}/user`} render={() => (
                this.isLoggedIn() ? <UserCreate /> : <AuthenticationRequest
                  referrer={`/${basePath}/user`}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={`/${basePath}/user/:userId`} render={(route) => (
                this.isLoggedIn() ? <UserEdit /> : <AuthenticationRequest
                  referrer={route.location.pathname}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={`/${basePath}/tokens`} render={() => (
                  this.isLoggedIn() ? <TokenSearch /> : <AuthenticationRequest
                    referrer={`/${basePath}/tokens`}
                    uiUrl={this.props.advertisedUrl}
                    appClientId={this.props.appClientId}
                    authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={`/${basePath}/token/newApiToken`} render={() => (
                  this.isLoggedIn() ? <TokenCreate /> : <AuthenticationRequest
                    referrer={`/${basePath}/token/newApiToken`}
                    uiUrl={this.props.advertisedUrl}
                    appClientId={this.props.appClientId}
                    authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              <Route exact path={`/${basePath}/token/:tokenId`} render={(route) => (
                this.isLoggedIn() ? <TokenEdit /> : <AuthenticationRequest
                  referrer={route.location.pathname}
                  uiUrl={this.props.advertisedUrl}
                  appClientId={this.props.appClientId}
                  authenticationServiceUrl={this.props.authenticationServiceUrl} />
              )} />

              {/* Fall through to 404 */}
              <Route render={(route) => {
                console.log(route)
                return (
                  <PathNotFound />
                )
              }} />

            </Switch>
          </div>
        </main>
        <Dialog
          title='Unauthorised!'
          actions={[
            <FlatButton
              label='Log in again'
              primary
              onTouchTap={this.props.handleSessionTimeout}
            />
          ]}
          modal
          open={this.props.showUnauthorizedDialog}
        >
          It's likely that your session has timed-out. Would you like to try logging in again?
        </Dialog>
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
  showUnauthorizedDialog: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  idToken: state.authentication.idToken,
  showUnauthorizedDialog: state.login.showUnauthorizedDialog,
  advertisedUrl: state.config.advertisedUrl,
  appClientId: state.config.appClientId,
  authenticationServiceUrl: state.config.authenticationServiceUrl,
  authorisationServiceUrl: state.config.authorisationServiceUrl,
  basePath: state.config.basePath
})

const mapDispatchToProps = dispatch => bindActionCreators({
  handleSessionTimeout
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
