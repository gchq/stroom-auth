import React, { Component } from 'react'
import PropTypes, { object } from 'prop-types'
import { Route, Redirect, NavLink, withRouter, Switch } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'

import './App.css'
import logo from './logo.svg'
import Login from '../../containers/login'
import Logout from '../../containers/logout'
import About from '../../containers/about'
import User, {UserCreate, UserEdit, UserSearch} from '../../containers/user'
import NewUser from '../../containers/newUser'
import PathNotFound from '../../containers/pathNotFound'
import UserCreateForm from '../../containers/createUser'
import UserEditForm from '../../containers/editUser'
import FlatButton from 'material-ui/FlatButton'
import LogOutAndInNavLink from '../../containers/logOutAndInNavLink'
import Person from 'material-ui-icons/Person'
import {fullWhite} from 'material-ui/styles/colors'
import { goToStroom } from '../../modules/sidebar'
import iconBlue from './../../icon-blue-small.png'

class App extends Component {

  isLoggedIn(){
    return this.props.token ? true : false
    // return localStorage.getItem('token') ? true : false
  }

  render() {
    // const token = localStorage.getItem('token')
    return (
      <div className="App">
        {this.isLoggedIn() ? (
        <AppBar
          title={
            <img src={logo} className="App-logo" alt="Stroom logo"/>}
              iconElementLeft={<div/>}
              iconElementRight= {
                <div className="App-appBar-buttons">
                  <FlatButton onClick={() => this.props.goToStroom(this.props.token)} label="Go to Stroom" primary={true} labelStyle={{color:'white'}}
                    icon={<img src={iconBlue} alt="Stroom logo"/>}/>
                  <NavLink to='/userSearch'>
                    <FlatButton label="Users" labelStyle={{color:'white'}} icon={<Person color={fullWhite}/>}/>
                  </NavLink>
                  <LogOutAndInNavLink/>
                </div>
              }
          />
        ) : (<div/>)}

        <main className={this.isLoggedIn() ? "main" : "main-login"}>
          <div className="container">
            <div>
              <Switch>
                <Route exact path="/" render={() => (
                  this.isLoggedIn() ? (
                    <UserSearch/> 
                  ) : (
                    <Redirect to={{
                      pathname: '/login',
                      state: {referrer:'/user'}}}/>
                  )
                )} />

                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/about" component={About}/>
                <Route exact path="/newUser" component={NewUser}/>
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
                      state: {referrer:'/user'}}}/>
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
          </div>
        </main>
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
  token: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  token: state.login.token
})

const mapDispatchToProps = dispatch => bindActionCreators({
  goToStroom
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
