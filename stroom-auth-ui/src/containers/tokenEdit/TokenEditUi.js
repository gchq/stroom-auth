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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextField, Toggle } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import CopyToClipboard from 'react-copy-to-clipboard'
import ContentCopy from 'material-ui-icons/ContentCopy'
import { amber900 } from 'material-ui/styles/colors'

import './TokenEdit.css'
import {toggleEnabledState} from '../../modules/token'
import {saveChanges as onSubmit, toggleAlertVisibility} from '../../modules/user'
import { renderField } from '../../renderField'

export class TokenEditUi extends Component {

  render () {
    const { handleSubmit, alertText, showAlert, toggleAlertVisibility, form, token, toggleEnabledState } = this.props

    const jws = token !== undefined ? token.token : ''

    return (
              <form onSubmit={handleSubmit}>
            <div className='header'>
<CopyToClipboard text={jws}>
            <button><FontAwesomeIcon icon='copy'/> Copy API key to clipboard</button>
          </CopyToClipboard >
          &nbsp;&nbsp;
          <NavLink to='/tokens'>
            <button>OK</button>
          </NavLink>
</div>
<div className='EditToken__content'>

        <div className='left-container'>
              <Field
                disabled
                className='TokenEditForm-field'
                name='user_email'
                label='Issued to'
                type='text'
                component={renderField}
                />
              <Field
                disabled
                className='TokenEditForm-field'
                name='token'
                label='API key'
                type='textarea'
                component={renderField}
                />
          <div className='field-container'>
            <div className='label-container'>
              <label>Enabled</label>
            </div>
            <div className='input-container'>
              <Field
                className='TokenEditForm-field'
                name='enabled' 
                component={Toggle}
                onChange={() => toggleEnabledState()} />
            </div>
          </div>
              <Field
                disabled
                className='TokenEditForm-field'
                name='expires_on'
                component={renderField}
                type='text'
                label='Expires on'
                />
        </div>
        <div className='right-container'>
              <Field
                disabled
                className='TokenEditForm-field'
                name='issued_on'
                label='Issued on'
                component={renderField}
                />
              <Field
                disabled
                className='TokenEditForm-field'
                name='updated_on'
                label='Updated on'
                component={renderField}
                />
              <Field
                disabled
                className='TokenEditForm-field'
                name='updated_by_user'
                label='Updated by'
                component={renderField}
                />
        </div>
        </div>
        <Snackbar
          open={showAlert}
          message={alertText}
          autoHideDuration={4000}
          onRequestClose={() => toggleAlertVisibility('')}
        />

        </form>
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
