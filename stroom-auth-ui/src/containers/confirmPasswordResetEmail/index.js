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
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Card from 'material-ui/Card'

import './ConfirmPasswordResetEmail.css'
import '../Layout.css'

class ConfirmPasswordResetEmail extends Component {
  render() {
    return (
        <div className='content-floating-without-appbar'>
          <Card className="ConfirmPasswordResetEmail-card">
              <h3>Password reset email has been sent.</h3>
              <p>Please check your email. You should receive a message with a link that will let you change your password. This link will be valid for five minutes.</p>
          </Card>
        </div>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmPasswordResetEmail)