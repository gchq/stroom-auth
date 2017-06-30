import React from 'react'
import { Field } from 'redux-form'

import FlatButton from 'material-ui/FlatButton'
import { MenuItem } from 'material-ui/Menu'
import { SelectField, TextField } from 'redux-form-material-ui'

import { required, email } from '../../validations'

export default props => {
  const {pristine, submitting } = props
  return (
      <div>
          <div>
            <Field 
              className="CreateUserForm-field"
              name="email"
              component={TextField}
              hintText="Email"
              validate={[required]}
              warn={email}
            />
          </div>
          <div>
            <Field
              className="CreateUserForm-field"
              name="password"
              component={TextField}
              hintText="Password"
              validate={[required]}
            />
          </div>
          <div>
            <Field
              className="CreateUserForm-field"
              name="first_name"
              component={TextField}
              hintText="First Name"
            />
          </div>
          <div>
            <Field
              className="CreateUserForm-field"
              name="last_name"
              component={TextField}
              hintText="Last Name"
            />
          </div>
          <div>
            <Field
              className="CreateUserForm-field"
              name="comments"
              component={TextField}
              hintText="Comments"
            />
          </div>

          <div>
            <Field name="state" component={ SelectField } hintText="The state of this user account">
              <MenuItem value="enabled" primaryText="Enabled"/>
              <MenuItem value="disabled" primaryText="Disabled"/>
              <MenuItem value="locked" primaryText="Locked"/>
            </Field>
          </div>

    </div>
  )
}
