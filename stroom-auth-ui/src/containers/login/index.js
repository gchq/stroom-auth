import React from 'react'

import PropTypes, {object} from 'prop-types'

import reactReferer from 'react-referer';

import { Button, Card, Input, Row, Col } from 'react-materialize'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {attempLogin} from '../../modules/login'

import './Login.css'

class Login extends React.Component {
  //TODO: if there's a referer then redirect to the referer after login

  constructor(props, context) {
    super(props, context)
    this.state = {
      username: '',
      password: '',
      referer: reactReferer.referer()
    }

  }

  login(username, password) {
    //TODO get current page. If it's the same as referrer don't pass the referrer.
    this.props.attempLogin(this.state.username, this.state.password, this.state.referer, this.context.router.history)
  }      

  render() {
    return(
      <Row>
          <Col s={4} />
          <Col s={4}>
            <div>
              <form>
                <Card title='Please log in' actions={[
                  <Button key="submitButton" type="button" waves='light' className="Login-button" onClick={ () => this.login(this.props.username, this.props.password)} onSubmit={ () => this.login(this.props.username, this.props.password)}>Log in</Button>
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

Login.contextTypes = {
  router: PropTypes.shape({
    history: object.isRequired,
  }),
};

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