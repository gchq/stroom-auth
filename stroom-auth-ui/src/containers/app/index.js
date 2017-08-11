import React, { Component } from 'react'
import PropTypes, { object } from 'prop-types'
import { Route, Redirect, NavLink, withRouter, Switch } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import ExitToApp from 'material-ui-icons/ExitToApp'
import Lock from 'material-ui-icons/Lock'

import './App.css'
import logo from './logo.svg'
import Login from '../../containers/login'
import Logout from '../../containers/logout'
import {handleSessionTimeout} from '../../modules/login'
import About from '../../containers/about'
import User, {UserCreate, UserEdit, UserSearch} from '../../containers/user'
import NewUser from '../../containers/newUser'
import PathNotFound from '../../containers/pathNotFound'
import UserCreateForm from '../../containers/createUser'
import UserEditForm from '../../containers/editUser'
import ResetPassword from '../../containers/resetPassword'
import FlatButton from 'material-ui/FlatButton'
import ChangePassword from '../../containers/changePassword'
import Person from 'material-ui-icons/Person'
import MoreVert from 'material-ui-icons/MoreVert'
import {fullWhite} from 'material-ui/styles/colors'

import { goToStroom } from '../../modules/sidebar'
import iconBlue from './../../icon-blue-small.png'

class App extends Component {

  isLoggedIn(){
    return this.props.token ? true : false
  }

  render() {
    return (
      <div className="App">
        {this.isLoggedIn() ? (
        <AppBar
          title={
            <img src={logo} className="App-logo" alt="Stroom logo"/>}
              iconElementLeft={<div/>}
              iconElementRight= {
                <div className="App-appBar-buttons">
                  <FlatButton onClick={() => this.props.goToStroom(this.props.token)} 
                    label="Go to Stroom" primary={true}
                    icon={<img src={iconBlue} alt="Stroom logo"/>}/>
                  <NavLink to='/userSearch'>
                    <FlatButton 
                      label="Search users"
                      icon={<Person color={fullWhite}/>}/>
                  </NavLink>
                  
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
          <div className={this.isLoggedIn() ? 'container' : 'container-login'}>
            <Switch>
              <Route exact path="/" render={() => (
                this.isLoggedIn() ? (
                  <UserSearch/> 
                ) : (
                  <Redirect to={{
                    pathname: '/login',
                    state: {referrer:'/'}}}/>
                )
              )} />

              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/about" component={About}/>
              <Route exact path="/newUser" component={NewUser}/>
              <Route exact path="/resetPassword" component={ResetPassword}/>

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
