import React, { Component } from 'react'
import { Row, Col, Navbar } from 'react-materialize'
import { Route } from 'react-router-dom'

import './App.css'
import logo from './logo.png'
import Login from '../../containers/login'
import About from '../../containers/about'
import User from '../../containers/user'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar className="App-header">
          <Row>
            <Col s={1} className="App-logo" ><img src={logo} className="App-logo" alt="Stroom logo" /></Col>
          </Row>
        </Navbar>
        
        <main>
          <Route exact path="/login/" component={Login} />
          <Route exact path="/login/about-us" component={About} />
          <Route exact path="/login/user" component={User} />
        </main>
      </div>
    )
  }
}

export default App

