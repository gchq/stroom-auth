import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import PropTypes, {object} from 'prop-types'
import queryString from 'query-string'

import { Button, Card, Input, Row, Col, Preloader } from 'react-materialize'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {attempLogin} from '../../modules/login'

import './Login.css'

class Login extends Component {

  constructor(props, context) {
    super(props, context)
    // Try and get the referrer, or if there isn't one use '/'. E.g. one might use the following to set the referrer.
    // <Redirect to={{
    //    pathname: '/login',
    //    state: {referrer:'/user'}}}/>
    const referrer = this.context.router.history.location.state !== undefined ? this.context.router.history.location.state.referrer : ''

    this.state = {
      username: '',
      password: '',
      referrer
    }
  }

  login(username, password) {
    this.props.attempLogin(this.state.username, this.state.password, this.state.referrer)
  }

  render() {
    const isLoggedIn = this.props.token !== ''
 
    return (
      <Row>
          <Col s={4} />
          <Col s={4}>
            <div>
              { isLoggedIn ? (
                <Card title='You are already logged in. Why not try going somewhere else?' />
              ) : (
                <form>
                  <Card title='Please log in' actions={[
                    <Row className="Login-submitButtonRow" key="submitButton">
                      <Col s={6}>
                        <Button type="button" waves='light' className="Login-button" 
                          onClick={ () => this.login(this.props.username, this.props.password)} 
                          onSubmit={ () => this.login(this.props.username, this.props.password)}>
                            Log in
                        </Button>
                      </Col>
                      <Col s={4}>
                        {this.props.showLoader ? (<Preloader size='small'/>) : (<div/>)}
                      </Col>
                    </Row>

                  ]}>
                    <Row>
                      <Input label="Username" s={12} 
                        value={this.state.username} onChange={ (e) => this.setState({username: e.target.value})}/>
                    </Row>
                    <Row>
                      <Input type="password" label="Password" s={12} 
                        value={this.state.password} onChange={ (e) => this.setState({password: e.target.value})}/>
                    </Row>
                    {this.props.errorText !== '' ? (
                      <Row>
                        <div color="error"><p> {this.props.errorText}</p></div>
                      </Row>
                    ) : (
                      <div/>
                    )}
                  </Card>
                </form>
              )}
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
}

Login.propTypes ={
  token: PropTypes.string.isRequired,
  errorStatus: PropTypes.number,
  errorText: PropTypes.string,
  showLoader: PropTypes.bool
}

const mapStateToProps = state => ({
    token: state.login.token,
    errorStatus: state.login.errorStatus,
    errorText: state.login.errorText,
    showLoader: state.login.showLoader
})

const mapDispatchToProps = dispatch => bindActionCreators({
  attempLogin,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)