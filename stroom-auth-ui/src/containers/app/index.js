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
import { goToStroom } from '../../modules/sidebar'
import { relativePath } from '../../relativePush'
import { updateConfig } from '../../modules/config'

class App extends Component {
  isLoggedIn () {
    return !!this.props.idToken
  }

  render () {
    var configuration = fetch('/config.json', {method: 'get'})
      .then(response => response.json())
      .then(config => config)

    this.context.store.dispatch(updateConfig(configuration))

    let rootPath = this.props.rootPath
    return (
      <div className='App'>
        <main className='main'>
          <div >
            <BrowserRouter basename={rootPath} />
            <Switch>
              {/* Authentication routes */}
              <Route exact path={relativePath('/handleAuthentication')} component={HandleAuthenticationResponse} />
              <Route exact path={relativePath('/handleAuthenticationResponse')} component={HandleAuthenticationResponse} />

              {/* Routes not requiring authentication */}
              <Route exact path={relativePath('/login')} component={Login} />
              <Route exact path={relativePath('/logout')} component={Logout} />
              <Route exact path={relativePath('/loggedOut')} component={LoggedOut} />
              <Route exact path={relativePath('/newUser')} component={NewUser} />
              <Route exact path={relativePath('/resetPassword')} component={ResetPassword} />
              <Route exact path={relativePath('/confirmPasswordResetEmail')} component={ConfirmPasswordResetEmail} />
              <Route exact path={relativePath('/resetPasswordRequest')} component={ResetPasswordRequest} />
              <Route exact path={relativePath('/Unauthorised')} component={Unauthorised} />

              {/* Routes requiring authentication */}
              <Route exact path={relativePath('/')} render={() => (
                this.isLoggedIn() ? <Home /> : <AuthenticationRequest referrer='/' />
              )} />

              <Route exact path={relativePath('/userSearch')} render={() => (
                this.isLoggedIn() ? <UserSearch /> : <AuthenticationRequest referrer='/userSearch' />
              )} />

              <Route exact path={relativePath('/changepassword')} render={(route) => (
                this.isLoggedIn() ? <ChangePassword /> : <AuthenticationRequest referrer={route.location.pathname} />
              )} />

              <Route exact path={relativePath('/user')} render={() => (
                this.isLoggedIn() ? <UserCreate /> : <AuthenticationRequest referrer='/user' />
              )} />

              <Route exact path={relativePath('/user/:userId')} render={(route) => (
                this.isLoggedIn() ? <UserEdit /> : <AuthenticationRequest referrer={route.location.pathname} />
              )} />

              <Route exact path={relativePath('/tokens')} render={() => (
                  this.isLoggedIn() ? <TokenSearch /> : <AuthenticationRequest referrer='/tokens' />
              )} />

              <Route exact path={relativePath('/token/newApiToken')} render={() => (
                  this.isLoggedIn() ? <TokenCreate /> : <AuthenticationRequest referrer='/token/newApiToken' />
              )} />

              <Route exact path={relativePath('/token/:tokenId')} render={(route) => (
                this.isLoggedIn() ? <TokenEdit /> : <AuthenticationRequest referrer={route.location.pathname} />
              )} />

              {/* Fall through to 404 */}
              <Route component={PathNotFound} />

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
  rootPath: state.config.rootPath
})

const mapDispatchToProps = dispatch => bindActionCreators({
  goToStroom,
  handleSessionTimeout
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
