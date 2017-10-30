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

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'
import { NavLink } from 'react-router-dom'

import { SelectField, TextField, Toggle } from 'redux-form-material-ui'
import { MenuItem } from 'material-ui/Menu'
import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'

import CopyToClipboard from 'react-copy-to-clipboard'
import ContentCopy from 'material-ui-icons/ContentCopy'
import { amber900 } from 'material-ui/styles/colors'

import './TokenEdit.css'
import {toggleEnabledState} from '../../modules/token'
import {saveChanges as onSubmit, toggleAlertVisibility} from '../../modules/user'

export class TokenEditUi extends Component {

  render () {
    const { handleSubmit, pristine, submitting, alertText, showAlert, toggleAlertVisibility, form, token, toggleEnabledState } = this.props

    const jws = token !== undefined ? token.token : ''

    return (
      <Card className='EditUserForm-card'>
        <form onSubmit={handleSubmit}>
          <div className='field-container'>
            <div className='label-container'>
              <label>Issued to</label>
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
          <div className='field-container'>
            <div className='label-container'>
              <label>Enabled</label>
            </div>
            <div className='input-container'>
              <Field
                className='TokenEditForm-field'
                name='enabled' component={Toggle}
                onChange={() => toggleEnabledState()} />
            </div>
          </div>
          <div className='field-container'>
            <div className='label-container'>
              <label>Expires on</label>
            </div>
            <div className='input-container'>
              <Field
                disabled
                className='TokenEditForm-field'
                name='expires_on'
                component={TextField}
                />
            </div>
          </div>
          <div className='field-container'>
            <div className='label-container'>
              <label>Issued on</label>
            </div>
            <div className='input-container'>
              <Field
                disabled
                className='TokenEditForm-field'
                name='issued_on'
                component={TextField}
                />
            </div>
          </div>
          <div className='field-container'>
            <div className='label-container'>
              <label>Updated on</label>
            </div>
            <div className='input-container'>
              <Field
                disabled
                className='TokenEditForm-field'
                name='updated_on'
                component={TextField}
                />
            </div>
          </div>
          <div className='field-container'>
            <div className='label-container'>
              <label>Updated by</label>
            </div>
            <div className='input-container'>
              <Field
                disabled
                className='TokenEditForm-field'
                name='updated_by_user'
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
  toggleAlertVisibility,
  toggleEnabledState
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxTokenEditUi)
