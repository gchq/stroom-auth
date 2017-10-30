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

import './CreateTokenForm.css'
import '../Layout.css'
import { createToken as onSubmit, userAutoCompleteChange } from '../../modules/token'

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
                  label='Create API key' />
                &nbsp;&nbsp;
                <NavLink to='/tokens'>
                  <RaisedButton
                    primary
                    label='Cancel' />
                </NavLink>
              </div>
            </form>
          </div>
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
  matchingAutoCompleteResults: state.token.matchingAutoCompleteResults
})

const mapDispatchToProps = dispatch => bindActionCreators({
  userAutoCompleteChange,
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxTokenCreateForm)
