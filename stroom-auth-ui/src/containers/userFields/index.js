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
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import { MenuItem } from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'
import { SelectField, TextField } from 'redux-form-material-ui'

import './UserFields.css'
import { required, email } from '../../validations'

/*
This can display all user fields, or not. 
*/
class UserFields extends Component {
  constructor() {
    super()
    this.state = {
      isPasswordEditingEnabled: false
    }
  }

  handleShowPasswordField() {
    this.setState({isPasswordEditingEnabled: true})
  }

  render() {
    const { showCalculatedFields, constrainPasswordEditing } = this.props
    const showPasswordField = this.state.isPasswordEditingEnabled || !constrainPasswordEditing
    return (
      <div className="container">
          <div className="left-container">
            <div className="field-container">
              <div className="label-container">
                <label>Email</label>
              </div>
              <div className="input-container">
                <Field 
                  className="CreateUserForm-field"
                  name="email"
                  component={TextField}
                  validate={[required]}
                  warn={email}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="label-container">
                <label>Password</label>
              </div>
              <div className="input-container">

                {showPasswordField ? (
                  <Field
                    className="CreateUserForm-field"
                    name="password"
                    type="password"
                    component={TextField}
                    validate={[required]}/>
                ) : (
                  <FlatButton
                    label="Edit password"
                    secondary={true}
                    onTouchTap={() => this.handleShowPasswordField()}/>
                )}
              </div>

            </div>
            <div className="field-container">
              <div className="label-container">
                <label>First name</label>
              </div>
              <div className="input-container">
                <Field
                  className="CreateUserForm-field"
                  name="first_name"
                  component={TextField}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="label-container">
                <label>Last name</label>
              </div>
              <div className="input-container">
                <Field
                  className="CreateUserForm-field"
                  name="last_name"
                  component={TextField}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="label-container">
                <label>Comments</label>
              </div>
              <div className="input-container">
                <Field
                  className="CreateUserForm-field"
                  name="comments"
                  component={TextField}
                  multiLine={true}
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>State</label>
              </div>
              <div className="input-container">
                <Field name="state" 
                  component={ SelectField }
                  validate={[required]}>
                  <MenuItem value="enabled" primaryText="Enabled"/>
                  <MenuItem value="disabled" primaryText="Disabled"/>
                  <MenuItem value="locked" primaryText="Locked"/>
                </Field>
              </div>
            </div>
          </div>

          {showCalculatedFields ? (
          <div className="right-container">
            <div className="field-container">
              <div className="label-container">
                <label>Login failures</label>
              </div>
              <div className="input-container">
                <Field
                  disabled={true}
                  className="CreateUserForm-field"
                  name="login_failures"
                  component={TextField}
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>Login count</label>
              </div>
              <div className="input-container">
                <Field
                  disabled={true}
                  className="CreateUserForm-field"
                  name="login_count"
                  component={TextField}
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>Last login</label>
              </div>
              <div className="input-container">
                <Field
                  disabled={true}
                  className="CreateUserForm-field"
                  name="last_login"
                  component={TextField}
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>Updated on</label>
              </div>
              <div className="input-container">
                <Field
                  disabled={true}
                  className="CreateUserForm-field"
                  name="updated_on"
                  component={TextField}
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>Updated by</label>
              </div>
              <div className="input-container">
                <Field
                  disabled={true}
                  className="CreateUserForm-field"
                  name="updated_by_user"
                  component={TextField}
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>Created on</label>
              </div>
              <div className="input-container">
                <Field
                  disabled={true}
                  className="CreateUserForm-field"
                  name="created_on"
                  component={TextField}
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>Created by</label>
              </div>
              <div className="input-container">
                <Field
                  disabled={true}
                  className="CreateUserForm-field"
                  name="created_by_user"
                  component={TextField}
                />
              </div>
            </div>
          </div>
          ) : (<div/>)}
      </div>
    )
  }
}


UserFields.propTypes = {
  showCalculatedFields: PropTypes.bool.isRequired,
  constrainPasswordEditing: PropTypes.bool.isRequired
}

export default UserFields