import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Navbar, NavItem } from 'react-materialize'
import { Route, Redirect, NavLink, withRouter } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './App.css'
import logo from './logo.png'
import Login from '../../containers/login'
import About from '../../containers/about'
import User from '../../containers/user'

const applicationRoot = '/login'

class App extends Component {

  isLoggedIn(router){
    return this.props.token ? true : false
  }

  render() {
    return (
      <div className="App">
        <Navbar brand={<img src={logo} className="App-logo" alt="Stroom logo" />} right className="App-header">
          <li><NavLink to="user">User</NavLink></li>
          <li><NavLink to="login">Login</NavLink></li>
          <li><NavLink to="about">About</NavLink></li>
        </Navbar>
        
        
        <main>
          <Route exact path="/login" component={Login} />
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
        </main>
      </div>
    )
  }
}

App.contextTypes = { store: PropTypes.object };

App.propTypes ={
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
