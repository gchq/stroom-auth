import React, { Component } from 'react'
import PropTypes, { object } from 'prop-types'
import { Route, Redirect, NavLink, withRouter } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AppBar from 'material-ui/AppBar'
import Grid from 'material-ui/Grid'
import Toolbar from 'material-ui/Toolbar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper'

import './App.css'
import logo from './logo.png'
import Login from '../../containers/login'
import Logout from '../../containers/logout'
import About from '../../containers/about'
import User from '../../containers/user'
import UserSearch from '../../containers/userSearch'
import LogOutAndInNavLink from '../../containers/logOutAndInNavLink'

class App extends Component {

  isLoggedIn(router){
    return this.props.token ? true : false
  }

  render() {
    return (
      <div className="App">
        <AppBar position="static" className="App-header" color="primary">
          <Toolbar >
            <img src={logo} className="App-logo" alt="Stroom logo"/>
          </Toolbar>
        </AppBar>

        <main>
          <Grid className='App-leftNav' container justify="center">
            {this.props.token !== '' ? (
            <Grid item xs={2}>
                <Paper>
                  <List>
                    <NavLink to='user'>
                      <ListItem button><ListItemText primary="Create a user" /></ListItem>
                    </NavLink>
                    <NavLink to='userSearch'>
                      <ListItem button><ListItemText primary="List users" /></ListItem>
                    </NavLink>
                    <Divider/>
                    <LogOutAndInNavLink/>
                  </List>
                </Paper>
            </Grid>
            ) : (<div/>)}

            <Grid item xs={10}>
              <Route exact path="/" component={this.props.token !== '' ? UserSearch : Login} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/about" component={About} onEnter={() => this.checkAuth()}/>
              <Route exact path="/user" render={(router) => (
                this.isLoggedIn(router) ? (
                  <User />
                ) : (
                  // We record the referrer because Login needs it to redirect back to after a successful login.
                  <Redirect to={{
                    pathname: '/login',
                    state: {referrer:'/user'}}}/>
                )
              )}/>
              <Route exact path="/userSearch" render={(router) => (
                this.isLoggedIn(router) ? (
                  <UserSearch />
                ) : (
                  // We record the referrer because Login needs it to redirect back to after a successful login.
                  <Redirect to={{
                    pathname: '/login',
                    state: {referrer:'/userSearch'}}}/>
                )
              )}/>
            </Grid>
          </Grid>
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
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))