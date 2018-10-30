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
import { connect } from 'react-redux'
import PropTypes, { object } from 'prop-types'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Countdown from 'react-countdown-now'

import { Card, CardTitle } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import Cookies from 'cookies-js'

import queryString from 'query-string'

import './ChangePassword.css'
import '../Layout.css'
import { required } from '../../validations'
import { changePassword as onSubmit } from '../../modules/user'

class ChangePassword extends Component {
  componentDidMount () {
    const query = queryString.parse(this.context.router.route.location.search)

    if (query.redirect_url) {
      const redirectUrl = decodeURIComponent(query.redirect_url)
      this.props.change('redirectUrl', redirectUrl)
    }

      const username = Cookies.get('username')
      this.props.change('email', username)
  }

  render () {
    const { handleSubmit, pristine, submitting, showAlert, changePasswordErrorMessage } = this.props

    let title = 'Change your password'
    if (showAlert && this.redirectUrl) {
      title = 'Your password has been changed'
    }

    return (
      <div className='content-floating-with-appbar'>
        <Card className='ChangePassword-main'>
          <CardTitle className='ChangePassword-title' title={title} />
          <div className='ChangePassword-contents'>
            {!showAlert ? (
              <form onSubmit={handleSubmit}>
                <div style={{display: 'none'}}>
                  <div className='left-container'>
                    <div className='redirectUrl-field-container'>
                      <div className='redirectUrl-label-container'>
                        <label className='redirectUrl-label'>Redirect URL</label>
                      </div>
                      <div className='input-container'>
                        <Field
                          className='redirectUrl-field'
                          name='redirectUrl'
                          type='hidden'
                          component={TextField} />
                      </div>
                    </div>
                  </div>
                  <div className='left-container'>
                    <div className='email-field-container'>
                      <div className='email-label-container'>
                        <label className='email-label'>Email</label>
                      </div>
                      <div className='input-container'>
                        <Field
                          className='email-field'
                          name='email'
                          type='hidden'
                          component={TextField} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='left-container'>
                  <div className='ChangePassword-field-container'>
                    <div className='ChangePassword-label-container'>
                      <label className='ChangePassword-label'>Old password</label>
                    </div>
                    <div className='input-container'>
                      <Field
                        className='ChangePassword-field'
                        name='oldPassword'
                        type='password'
                        component={TextField}
                        validate={[required]} 
                        autoFocus/>
                    </div>
                  </div>
                </div>
                <div className='left-container'>
                  <div className='ChangePassword-field-container'>
                    <div className='ChangePassword-label-container'>
                      <label className='ChangePassword-label'>New password</label>
                    </div>
                    <div className='input-container'>
                      <Field
                        className='ChangePassword-field'
                        name='newPassword'
                        type='password'
                        component={TextField}
                        validate={[required]} />
                    </div>
                  </div>
                </div>
                <div className='left-container'>
                  <div className='ChangePassword-field-container'>
                    <div className='ChangePassword-label-container'>
                      <label className='ChangePassword-label'>New password again</label>
                    </div>
                    <div className='input-container'>
                      <Field
                        className='ChangePassword-field'
                        name='newPasswordConfirmation'
                        type='password'
                        component={TextField}
                        validate={[required]} />
                    </div>
                  </div>
                </div>

                <div>
                {changePasswordErrorMessage.map((error, index) => (<p key={index} className='ChangePassword-errorMessage'>{error}</p>))}
                </div>
                <br />

                <div className='ChangePassword-actions'>
                  <RaisedButton
                    className='ChangePassword-button'
                    primary
                    disabled={pristine || submitting}
                    type='submit'
                    label='Change password' />
                </div>

              </form>
            ) : undefined }

            {showAlert && !this.redirectUrl ? (
              <p>Your password has been changed.</p>
            ) : undefined }

            {showAlert && this.redirectUrl ? (
              <div>
                <br />
                <p>We're going to send you back to your original destination in&nbsp;
                  <Countdown
                    date={Date.now() + 5000}
                    renderer={({ hours, minutes, seconds, completed }) => <span className='ChangePassword-countdown'>{seconds}</span>}
                    onComplete={() => { window.location.href = this.redirectUrl }} />
                  &nbsp;seconds, or you can <a href={this.redirectUrl}>go there now.</a></p>
              </div>
            ) : undefined }
          </div>
        </Card>
      </div>
    )
  }
}

ChangePassword.contextTypes = {
  router: PropTypes.shape({
    history: object.isRequired
  })
}

const ReduxChangePassword = reduxForm({
  form: 'ChangePasswordForm'
})(ChangePassword)

const mapStateToProps = state => ({
  showAlert: state.user.showAlert,
  changePasswordErrorMessage: state.user.changePasswordErrorMessage
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxChangePassword)
