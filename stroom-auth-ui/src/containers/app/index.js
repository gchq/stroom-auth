import React, { Component } from 'react'
import { Row, Col, Navbar } from 'react-materialize'
import { Route } from 'react-router-dom'

import './App.css'
import logo from './logo.png'
import Login from '../../containers/login'
import About from '../../containers/about'
import User from '../../containers/user'

const applicationRoot = '/login/'

class App extends Component {

  isLoggedIn(){
    //TODO check state
  }

  checkAuth(nextState, replace) {
    if (!isLoggedIn()) {
      replace({
        pathname: '/login'
      })
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar className="App-header">
          <Row>
            <Col s={1} className="App-logo" ><img src={logo} className="App-logo" alt="Stroom logo" /></Col>
          </Row>
        </Navbar>
        
        <main>
          {/*If there's no token in the state then always redirect to login*/}
          <Route path={applicationRoot} component={App}>
            <Route exact path="/login" component={Login} />
            <Route exact path="/about-us" component={About} onEnter={checkAuth}/>
            <Route exact path="/user" component={User} onEnter={checkAuth}/>
          </Route>
        </main>
      </div>
    )
  }
}

export default App

