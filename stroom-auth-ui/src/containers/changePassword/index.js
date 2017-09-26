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

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import './ChangePassword.css'
import '../Layout.css'
import { required } from '../../validations'
import { changePasswordForCurrentUser as onSubmit, toggleAlertVisibility } from '../../modules/user'

const ChangePassword = props => {
  const { handleSubmit, pristine, submitting, showAlert, alertText, toggleAlertVisibility } = props
  return (
    <div className='content-floating-with-appbar'>
      <Card className='ChangePassword-main'>
        <div>
          <p>You can change your password below.</p>
          <form onSubmit={handleSubmit}>

            <Field
              className='ChangePassword-field'
              name='password'
              type='password'
              component={TextField}
              validate={[required]} />
            <br />
            <RaisedButton
              className='ChangePassword-button'
              primary
              disabled={pristine || submitting}
              type='submit'
              label='Change password' />
          </form>

          <Snackbar
            open={showAlert}
            message={alertText}
            autoHideDuration={4000}
            onRequestClose={() => toggleAlertVisibility('')}
                />
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
  alertText: state.user.alertText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit,
  toggleAlertVisibility
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxChangePassword)
