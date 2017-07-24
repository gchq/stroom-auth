import React from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'
import { MenuItem } from 'material-ui/Menu'
import { SelectField, TextField } from 'redux-form-material-ui'

import { required, email } from '../../validations'
import './UserFields.css'

const UserFields = props => {
  const {pristine, submitting, showCalculatedFields } = props
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
                <Field
                  className="CreateUserForm-field"
                  name="password"
                  component={TextField}
                  validate={[required]}
                />
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
                />
              </div>
            </div>

            <div className="field-container">
              <div className="label-container">
                <label>State</label>
              </div>
              <div className="input-container">
                <Field name="state" component={ SelectField }>
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
                  name="loginFailures"
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
                  name="loginCount"
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
                  name="lastLogin"
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
                  name="updatedOn"
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
                  name="updatedByUser"
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
                  name="createdOn"
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
                  name="createdByUser"
                  component={TextField}
                />
              </div>
            </div>
          </div>
          ) : (<div/>)}
    </div>
  )
}


UserFields.propTypes ={
  showCalculatedFields: PropTypes.bool.isRequired
}

export default UserFields