import React, { Component } from 'react'
import PropTypes, { object } from 'prop-types'
import { Route, Redirect, NavLink, withRouter, Switch } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
import Dialog from 'material-ui/Dialog'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import ExitToApp from 'material-ui-icons/ExitToApp'
import Lock from 'material-ui-icons/Lock'
import MoreVert from 'material-ui-icons/MoreVert'
import {fullWhite} from 'material-ui/styles/colors'

import './App.css'
import logo from './logo.svg'
import Login from '../../containers/login'
import Logout from '../../containers/logout'
import {UserCreate, UserEdit, UserSearch} from '../../containers/user'
import NewUser from '../../containers/newUser'
import PathNotFound from '../../containers/pathNotFound'
import ResetPassword from '../../containers/resetPassword'
import ChangePassword from '../../containers/changePassword'
import ResetPasswordRequest from '../../containers/resetPasswordRequest'
import ConfirmPasswordResetEmail from '../../containers/confirmPasswordResetEmail'
import Home from '../../containers/home'
import Unauthorised from '../../containers/unauthorised'
import {handleSessionTimeout} from '../../modules/login'
import { goToStroom } from '../../modules/sidebar'

class App extends Component {

  isLoggedIn(){
    return this.props.token ? true : false
  }

  render() {
    console.log('Mounted here:' + process.env.REACT_APP_ROOT_PATH)
    return (
      <div className="App">
        {this.isLoggedIn() ? (
        <AppBar
          title={<NavLink to='/'><img src={logo} className="App-logo" alt="Stroom logo"/></NavLink>}
              iconElementLeft={<div/>}
              iconElementRight= {
                <div className="App-appBar-buttons">
                  <IconMenu
                    iconButtonElement={
                      <IconButton className="App-iconButton"><MoreVert color={fullWhite}/></IconButton>
                    }>
                    {this.isLoggedIn() ? (
                      <div>
                      <NavLink to="/changepassword">
                        <MenuItem primaryText="Change password" leftIcon={<Lock/>}/>
                      </NavLink>
                      <NavLink to="/logout">
                        <MenuItem primaryText="Log out" leftIcon={<ExitToApp/>}/>
                      </NavLink>
                      </div>
                    ) : (
                      <NavLink to="/login">
                        <MenuItem primaryText="Log in"/>
                      </NavLink>
                    )}
                  </IconMenu>
                </div>
              }
          />
        ) : (<div/>)}

        <main className='main'>
          <div >
            <Switch>
              <Route exact path={process.env.REACT_APP_ROOT_PATH + "/"} render={() => (
                this.isLoggedIn() ? (
                  <Home/>
                ) : (
                  <Redirect to={{
                    pathname: process.env.REACT_APP_ROOT_PATH + '/login',
                    state: {referrer:'/'}}}/>
                )
              )} />

              <Route exact path={process.env.REACT_APP_ROOT_PATH + "/login"} component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/newUser" component={NewUser}/>
              <Route exact path="/resetPassword" component={ResetPassword}/>
              <Route exact path="/confirmPasswordResetEmail" component={ConfirmPasswordResetEmail}/>
              <Route exact path="/resetPasswordRequest" component={ResetPasswordRequest}/>
              <Route exact path="/Unauthorised" component={Unauthorised}/>

              <Route exact path="/userSearch" render={() => (
                this.isLoggedIn() ? (
                  <UserSearch/>
                ) : (
                  // We record the referrer because Login needs it to redirect back to after a successful login.
                  <Redirect to={{
                    pathname: '/login',
                    state: {referrer:'/userSearch'}}}/>
                )
              )}/>
              <Route exact path="/changepassword" render={(route) => (
                this.isLoggedIn() ? (
                  <ChangePassword/>
                ) : (
                   // We record the referrer because Login needs it to redirect back to after a successful login.
                  <Redirect to={{
                    pathname: '/login',
                    state: {referrer:route.location.pathname}}}/>
                )
              )}/>

              <Route exact path="/user" render={() => (
                this.isLoggedIn() ? (
                  <UserCreate/>
                ) : (
                  // We record the referrer because Login needs it to redirect back to after a successful login.
                  <Redirect to={{
                    pathname: '/login',
                    state: {referrer:'/user'}}}/>
                )
              )}/>

              <Route exact path="/user/:userId" render={(route) => (
                this.isLoggedIn() ? (
                  <UserEdit/>
                ) : (
                  // We record the referrer because Login needs it to redirect back to after a successful login.
                  <Redirect to={{
                    pathname: '/login',
                    state: {referrer:route.location.pathname}}}/>
                )
              )}/>
              <Route component={PathNotFound}/>

            </Switch>
          </div>
        </main>
         <Dialog
          title="Unauthorised!"
          actions={[
            <FlatButton
              label="Log in again"
              primary={true}
              onTouchTap={this.props.handleSessionTimeout}
            />
          ]}
          modal={true}
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
    history: object.isRequired,
  }),
}

App.propTypes = {
  token: PropTypes.string.isRequired,
  showUnauthorizedDialog: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  token: state.login.token,
  showUnauthorizedDialog: state.login.showUnauthorizedDialog
})

const mapDispatchToProps = dispatch => bindActionCreators({
  goToStroom,
  handleSessionTimeout
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
