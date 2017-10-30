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
import { Field, reduxForm } from 'redux-form'
import { NavLink } from 'react-router-dom'

import { TextField } from 'redux-form-material-ui'
import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'

import CopyToClipboard from 'react-copy-to-clipboard'
import ContentCopy from 'material-ui-icons/ContentCopy'
import { amber900 } from 'material-ui/styles/colors'

import './TokenEdit.css'
import {saveChanges as onSubmit, toggleAlertVisibility} from '../../modules/user'

const TokenEditUi = props => {
  const { handleSubmit, pristine, submitting, alertText, showAlert, toggleAlertVisibility, form, token } = props

  const jws = token !== undefined ? token.token : ''

  return (
    <Card className='EditUserForm-card'>
      <form onSubmit={handleSubmit}>
        <div className='field-container'>
          <div className='label-container'>
            <label>Issued to user</label>
          </div>
          <div className='input-container'>
            <Field
              disabled
              className='TokenEditForm-field'
              name='user_email'
              component={TextField}
              />
          </div>
        </div>
        <div className='field-container'>
          <div className='label-container'>
            <label>API key</label>
          </div>
          <div className='input-container'>
            <Field
              disabled
              className='TokenEditForm-field'
              name='token'
              component={TextField}
              />
          </div>
        </div>
        <br />
        <CopyToClipboard text={jws}>
          <RaisedButton
            label='Copy API key to clipboard'
            primary
            icon={<ContentCopy color={amber900} />} />
        </CopyToClipboard >
        &nbsp;&nbsp;
        <NavLink to='/tokens'>
          <RaisedButton
            primary
            label='OK' />
        </NavLink>
      </form>
      <Snackbar
        open={showAlert}
        message={alertText}
        autoHideDuration={4000}
        onRequestClose={() => toggleAlertVisibility('')}
      />
    </Card>
  )
}

const ReduxTokenEditUi = reduxForm({
  form: 'TokenEditForm'
})(TokenEditUi)

const mapStateToProps = state => ({
  token: state.token.lastReadToken,
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
)(ReduxTokenEditUi)
