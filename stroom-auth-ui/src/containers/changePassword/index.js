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

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import { Card, CardTitle } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import './ChangePassword.css'
import '../Layout.css'
import { required } from '../../validations'
import { changePasswordForCurrentUser as onSubmit } from '../../modules/user'

const ChangePassword = props => {
  const { handleSubmit, pristine, submitting, showAlert, changePasswordErrorMessage } = props
  return (
    <div className='content-floating-with-appbar'>
      <Card className='ChangePassword-main'>
        <CardTitle className='ChangePassword-title' title='Change your password' />
        <div className='ChangePassword-contents'>
          {!showAlert ? (
            <form onSubmit={handleSubmit}>
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
                      validate={[required]} />
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

              <p className='ChangePassword-errorMessage'>{changePasswordErrorMessage}</p>

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
          ) : (
            <p>Your password has been changed.</p>
          )}
        </div>
      </Card>
    </div>
  )
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
