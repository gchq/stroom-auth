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

const renderField = ({
        disabled,
        input,
        label,
        type,
        meta: { touched, error, warning }
      }) => (
        <div className='field-container'>
          <label>{label}</label>
          <div>
          {type === 'textarea' ? (
              <textarea rows='3'/>)
              :(
            <input disabled={disabled} {...input} type={type} />)}
            {touched &&
              ((error && <span className='field-container__error'>{error}</span>) ||
                (warning && <span className='field-container__warning'>{warning}</span>))}
          </div>
        </div>
      )


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
          const { showCalculatedFields, constrainPasswordEditing, error } = this.props
    const showPasswordField = this.state.isPasswordEditingEnabled || !constrainPasswordEditing
    return (
      <div className='container'>
        <div className='left-container'>
              <Field
                className='CreateUserForm-field'
                name='email'
                component={renderField}
                type="text"
                validate={[required]}
                warn={email}
                label='Email'
                />
              {showPasswordField ? (
                <Field
                  className='CreateUserForm-field'
                  name='password'
                  type='password'
                  component={renderField}
                  validate={[required]}
                  label='Password'/>
                ) : (
                  <div className='field-container'>
                    <label>Password</label>
                  <button
                    onClick={() => this.handleShowPasswordField()}>Edit password</button>
                    </div>
                )}

              <Field
                className='CreateUserForm-field'
                name='first_name'
                component={renderField}
                type='text'
                label='First name'/>
              <Field
                className='CreateUserForm-field'
                name='last_name'
                component={renderField}
                type='text'
                label='Last name'/>
              <Field
                className='CreateUserForm-field'
                name='comments'
                component={renderField}
                type='textarea'
                label='Comments'/>

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
                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='login_failures'
                  component={renderField}
                  type='text'
                  label='Login failures'/>

                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='login_count'
                  component={renderField}
                  type='text'
                  label='Login count'/>

                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='last_login'
                  component={renderField}
                  type='text'
                  label='Last login'/>

                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='updated_on'
                  component={renderField}
                  type='text'
                  label='Updated on'/>

                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='updated_by_user'
                  component={renderField}
                  type='text'
                  label='Updated by'/>

                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='created_on'
                  component={renderField}
                  type='text'
                  label='Created on'/>

                <Field
                  disabled
                  className='CreateUserForm-field'
                  name='created_by_user'
                  component={renderField}
                  type='text'
                  label='Created by'/>
          </div>
          ) : (<div />)}
              {error && <strong>{error}</strong>}

      </div>
    )
  }
}

UserFields.propTypes = {
  showCalculatedFields: PropTypes.bool.isRequired,
  constrainPasswordEditing: PropTypes.bool.isRequired
}

export default UserFields
