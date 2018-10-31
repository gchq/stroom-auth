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

import './UserFields.css'
import { required, email } from '../../validations'

/*
This can display all user fields, or not.
*/
class UserFields extends Component {
  constructor () {
    super()
    this.state = {
      isPasswordEditingEnabled: false
    }
  }

  handleShowPasswordField () {
    this.setState({isPasswordEditingEnabled: true})
  }

  render () {
    const { showCalculatedFields, constrainPasswordEditing } = this.props
    const showPasswordField = this.state.isPasswordEditingEnabled || !constrainPasswordEditing
    return (
      <div className='container'>
        <div className='left-container'>
          <div className='field-container'>
              <label>Email</label>
              <Field
                className='CreateUserForm-field'
                name='email'
                component="input"
                type="text"
                validate={[required]}
                warn={email}
                />
          </div>
          <div className='field-container'>
              <label>Password</label>
              {showPasswordField ? (
                <Field
                  className='CreateUserForm-field'
                  name='password'
                  type='password'
                  component='input'
                  validate={[required]} />
                ) : (
                  <div className='CreateUserForm-field_button'>
                  <button
                    onClick={() => this.handleShowPasswordField()}>Edit password</button>
                    </div>
                )}

          </div>
          <div className='field-container'>
              <label>First name</label>
              <Field
                className='CreateUserForm-field'
                name='first_name'
                component='input'
                type='text'
                />
          </div>
          <div className='field-container'>
              <label>Last name</label>
              <Field
                className='CreateUserForm-field'
                name='last_name'
                component='input'
                type='text'/>
          </div>
          <div className='field-container'>
              <label>Comments</label>
              <Field
                className='CreateUserForm-field'
                name='comments'
                component='input'
                type='text'multiLine
                />
          </div>

          <div className='field-container'>
              <label>Account status</label>
              <Field name='state'
                component='select'
                validate={[required]}>
                <option value='enabled'>Active</option>
                <option value='disabled'>Inactive</option>
                <option value='locked'>Locked</option>
              </Field>
          </div>
        </div>

        {showCalculatedFields ? (
          <div className='right-container'>
            <div className='field-container'>
                <label>Login failures</label>
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='login_failures'
                  component='input'
                  type='text'/>
            </div>

            <div className='field-container'>
                <label>Login count</label>
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='login_count'
                  component='input'
                  type='text'/>
            </div>

            <div className='field-container'>
                <label>Last login</label>
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='last_login'
                  component='input'
                  type='text'/>
            </div>

            <div className='field-container'>
                <label>Updated on</label>
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='updated_on'
                  component='input'
                  type='text'/>
            </div>

            <div className='field-container'>
                <label>Updated by</label>
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='updated_by_user'
                  component='input'
                  type='text'/>
            </div>

            <div className='field-container'>
                <label>Created on</label>
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='created_on'
                  component='input'
                  type='text'/>
            </div>

            <div className='field-container'>
                <label>Created by</label>
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='created_by_user'
                  component='input'
                  type='text'/>
            </div>
          </div>
          ) : (<div />)}
      </div>
    )
  }
}

UserFields.propTypes = {
  showCalculatedFields: PropTypes.bool.isRequired,
  constrainPasswordEditing: PropTypes.bool.isRequired
}

export default UserFields
