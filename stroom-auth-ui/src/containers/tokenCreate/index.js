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
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import { NavLink } from 'react-router-dom'

import { AutoComplete } from 'redux-form-material-ui'
import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import CopyToClipboard from 'react-copy-to-clipboard'
import ContentCopy from 'material-ui-icons/ContentCopy'
import { amber900 } from 'material-ui/styles/colors'

import './CreateTokenForm.css'
import '../Layout.css'
import { createToken as onSubmit, userAutoCompleteChange, handleTokenCreatedDialogClose } from '../../modules/token'

export class TokenCreateForm extends Component {
  render () {
    const { handleSubmit, pristine, submitting } = this.props
    return (
      <div className=''>
        <Card className='CreateTokenForm-card'>
          <div>
            <form onSubmit={handleSubmit}>
              <div className='left-container'>
                <div className='field-container'>
                  <div className='label-container'>
                    <label>User's email</label>
                  </div>
                  <div className='input-container'>
                    <Field
                      hintText='Type to search for a user'
                      component={AutoComplete}
                      name='email'
                      openOnFocus
                      dataSource={this.props.matchingAutoCompleteResults}
                      onChange={(_, autoCompleteText) => this.props.userAutoCompleteChange(autoCompleteText, this.props.idToken)}
                      />
                  </div>
                </div>
              </div>
              <br />
              <div>
                <RaisedButton
                  primary
                  disabled={pristine || submitting}
                  type='submit'
                  label='Issue API token to user' />
                &nbsp;&nbsp;
                <NavLink to='/tokens'>
                  <RaisedButton
                    primary
                    label='Cancel' />
                </NavLink>
              </div>
            </form>
          </div>
          <Dialog
            contentStyle={{maxWidth: 'none'}}
            title={<div>An API token has been created for this user</div>}
            actions={
              <div>
                <CopyToClipboard text={this.props.newlyCreatedToken}>
                  <FlatButton
                    label='Copy token to clipboard'
                    primary
                    icon={<ContentCopy color={amber900} />} />
                </CopyToClipboard >
                    &nbsp;&nbsp;
                <FlatButton
                  label='OK'
                  primary
                  onTouchTap={() => this.props.handleTokenCreatedDialogClose()} />
              </div>
                }
            modal={false}
            open={this.props.showTokenCreatedDialog}
            onRequestClose={() => this.props.handleTokenCreatedDialogClose()}>
            <p>User:</p><pre> {this.props.newlyCreatedTokenUser}</pre>
            <p>Token :</p><pre> {this.props.newlyCreatedToken}</pre>
          </Dialog>
        </Card>
      </div>
    )
  }
}

const ReduxTokenCreateForm = reduxForm({
  form: 'TokenCreateForm'
})(TokenCreateForm)

const mapStateToProps = state => ({
  idToken: state.authentication.idToken,
  matchingAutoCompleteResults: state.token.matchingAutoCompleteResults,
  showTokenCreatedDialog: state.token.showTokenCreatedDialog,
  newlyCreatedToken: state.token.newlyCreatedToken,
  newlyCreatedTokenUser: state.token.newlyCreatedTokenUser
})

const mapDispatchToProps = dispatch => bindActionCreators({
  userAutoCompleteChange,
  onSubmit,
  handleTokenCreatedDialogClose
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxTokenCreateForm)
