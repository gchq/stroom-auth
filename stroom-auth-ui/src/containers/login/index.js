import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LoginUI from './LoginUI'
import { fetchUser } from '../../modules/user'
import { checkForRememberMeToken } from '../../modules/login'

class Login extends Component {
  componentWillMount() {
    checkForRememberMeToken(this.context.store.dispatch)
  }

  render() {
    const { token } = this.props
    return (
      <div>
        {token ? (
          <Redirect to={{
            pathname: '/',
            state: {referrer:'/login'}
          }}/>
        ): (
          <LoginUI/>
        )}
      </div>
    )
  }
}

Login.PropTypes = {
  token: PropTypes.string.isRequired
}

Login.contextTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  token: state.login.token
})

const mapDispatchToProps = dispatch => bindActionCreators({
  checkForRememberMeToken
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)