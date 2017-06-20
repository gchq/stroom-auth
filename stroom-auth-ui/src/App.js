import React, { Component } from 'react'
import logo from './logo.png'
import './App.css'
import { Row, Col, Navbar } from 'react-materialize'

import Login from './Login'

function handleErrors(response) {
  if (!response.ok) {
    console.log(response.statusText)
    //TODO show error page
  }
  return response
}

class App extends Component {

  render() {
    var handleLogin = (username, password) => {
      // Call the authentication service to get a token.
      // If successful we re-direct to Stroom, otherwise we display a message.
      fetch(process.env.REACT_APP_STROOM_AUTH_SERVICE_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'post',
        mode: 'cors',
        body: JSON.stringify({
          username,
          password
        })
      })
        .then(handleErrors)
        .then(result => result.text())
        .then(token => {
          var loginUrl = process.env.REACT_APP_STROOM_UI_URL + '/?token=' + token
          window.location.href = loginUrl
        })
    }

    return (
      <div className="App">
        <Navbar className="App-header">
          <Row>
            <Col s={1} className="App-logo" ><img src={logo} className="App-logo" alt="Stroom logo" /></Col>
          </Row>
        </Navbar>

        <Row>
          <Col s={4} />
          <Col s={4}>
            <Login onSubmit={handleLogin} />
          </Col>
          <Col s={1} />
        </Row>
      </div>
    )
  }
}

export default App

