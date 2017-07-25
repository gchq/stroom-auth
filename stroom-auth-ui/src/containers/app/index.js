import React, { Component } from 'react'
import PropTypes, { object } from 'prop-types'
import { Route, Redirect, NavLink, withRouter, Switch } from 'react-router-dom'

import { Card } from 'material-ui/Card'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
// import Grid from 'material-ui/Grid'
import Toolbar from 'material-ui/Toolbar'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'

import './App.css'
import logo from './logo.svg'
import Login from '../../containers/login'
import Logout from '../../containers/logout'
import About from '../../containers/about'
import NewUser from '../../containers/newUser'
import User from '../../containers/user'
import UserSearch from '../../containers/userSearch'
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
  }

  render() {
    return (
      <div className="App">
        {this.isLoggedIn() ? (
        <AppBar
          title={<img src={logo} className="App-logo" alt="Stroom logo"/>}
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
            {/* {this.props.token !== '' ? (
              <div className="nav-container">

                <Card>
                  <List>
                    <NavLink to='/newUser'>
                      <ListItem primaryText="Create a user"/>
                    </NavLink>
                    <NavLink to='/userSearch'>
                      <ListItem primaryText="List users"/>
                    </NavLink>
                    <ListItem onClick={() => this.props.goToStroom(this.props.token)} primaryText="Go to stroom"/>
                    <Divider/>
                    <LogOutAndInNavLink/>
                  </List>
                </Card>
              </div>
            ) : (<div/>)} */}

            <div>
              <Switch>
                <Route exact path="/" component={this.props.token !== '' ? UserSearch : Login} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/about" component={About}/>
                <Route exact path="/newUser" component={NewUser}/>
                <Route exact path="/user" render={() => (
                  this.isLoggedIn() ? (
                    <UserCreateForm />
                  ) : (
                    // We record the referrer because Login needs it to redirect back to after a successful login.
                    <Redirect to={{
                      pathname: '/login',
                      state: {referrer:'/user'}}}/>
                  )
                )}/>

                <Route exact path="/user/:userId" render={(route) => (
                  this.isLoggedIn() ? (
                    <UserEditForm userId={route.match.params.userId}/>
                  ) : (
                    // We record the referrer because Login needs it to redirect back to after a successful login.
                    <Redirect to={{
                      pathname: '/login',
                      state: {referrer:'/user'}}}/>
                  )
                )}/>

                <Route exact path="/userSearch" render={() => (
                  this.isLoggedIn() ? (
                    <UserSearch />
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
