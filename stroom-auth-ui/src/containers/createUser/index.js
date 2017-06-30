import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'

import Card from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import { MenuItem } from 'material-ui/Menu'
import { SelectField, TextField } from 'redux-form-material-ui'

import './CreateUserForm.css'
import { onSubmit } from '../../modules/user'
import { required, email } from '../../validations'

const UserCreateForm = props => {
  const {handleSubmit, pristine, submitting } = props
  return (
    <Card className="CreateUserForm-card">
      <div>
        <h2>Please enter the details of the new user</h2>
        <form onSubmit={handleSubmit}>
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

          <div>
            <FlatButton 
              color="primary" className="User-button" 
              disabled={pristine || submitting}
              type="submit">
                Save changes to user
            </FlatButton>
    
          </div>
        </form>
      </div>
    </Card>
  )
}

const ReduxUserCreateForm = reduxForm({
  form: 'UserCreateForm'
})(UserCreateForm)

const mapStateToProps = state => ({
  token: state.login.token,
  showCreateLoader: state.user.showCreateLoader,
  email: state.user.email,
  password: state.user.password,
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserCreateForm)