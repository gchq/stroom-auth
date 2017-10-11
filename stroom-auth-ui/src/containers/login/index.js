/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import queryString from 'query-string'

import LoginUI from './LoginUI'
import { checkForRememberMeToken, changeRedirectUrl } from '../../modules/login'
import { relativePath } from '../../relativePush'

class Login extends Component {
  componentWillMount () {
    checkForRememberMeToken(this.context.store.dispatch)
    const queryParams = queryString.parse(this.props.location.search)
    const redirectUrl = queryParams['redirectUrl']
    this.context.store.dispatch(changeRedirectUrl(redirectUrl))
  }

  render () {
    const { token } = this.props
    let referrer = relativePath('/')
    return (
      <div>
        {token ? (
          <Redirect to={referrer + '/login'} />
        ) : (
          <LoginUI />
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
