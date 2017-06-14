import React from 'react'
import { Button, Card, Input, Row } from 'react-materialize'
import './Login.css'
import createReactClass from 'create-react-class'

import PropTypes from 'prop-types'

var Login = createReactClass({

  getInitialState: function () {
    return {
      username: '',
      password: ''
    }
  },

  handleLogin: function (event) {
    event.preventDefault()
    this.props.onSubmit(this.state.username, this.state.password)
  },

  updateUsernameValue: function (evt) {
    this.setState({
      username: evt.target.value
    })
  },

  updatePasswordValue: function (evt) {
    this.setState({
      password: evt.target.value
    })
  },

  render: function () {
    return (
      <div>
        <form>
          <Card title='Please log in' actions={[
            <Button key="submitButton" waves='light' className="Login-button" onClick={this.handleLogin} >Log in</Button>
          ]}>
            <Row>
              <Input label="Username" s={12} value={this.state.username} onChange={this.updateUsernameValue} />
            </Row>
            <Row>
              <Input type="password" label="Password" s={12} value={this.state.password} onChange={this.updatePasswordValue} />
            </Row>
          </Card>
        </form>
      </div>
    )
  }
})

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default Login
