import React from 'react'

import { Button, Card, Input, Row, Col } from 'react-materialize'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {attempLogin} from './modules/login'

import './Login.css'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return(
      <Row>
          <Col s={4} />
          <Col s={4}>
            <div>
              <form>
                <Card title='Please log in' actions={[
                  <Button key="submitButton" type="button" waves='light' className="Login-button" onClick={ () => this.props.attempLogin(this.state.username, this.state.password)} onSubmit={ () => this.props.attempLogin}>Log in</Button>
                ]}>
                  <Row>
                   <Input label="Username" s={12} 
                      value={this.state.username} onChange={ (e) => this.setState({username: e.target.value})}/>
                  </Row>
                  <Row>
                    <Input type="password" label="Password" s={12} 
                      value={this.state.password} onChange={ (e) => this.setState({password: e.target.value})}/>
                  </Row>
                </Card>
              </form>
            </div>
             </Col>
          <Col s={1} />
      </Row>
    )
  }
}

const mapStateToProps = state => ({
  // Nothing to save to state
})

const mapDispatchToProps = dispatch => bindActionCreators({
  attempLogin,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)