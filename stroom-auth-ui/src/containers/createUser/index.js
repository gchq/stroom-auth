import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

import { onSubmit } from '../../modules/user'
import './CreateUserForm.css'
import { required, email } from '../../validations'
import { renderInput, renderUserStateMenu } from '../../fieldRenderers'
import UserStateMenu from '../userStateMenu'

const UserCreateForm = props => {
  const {handleSubmit, pristine, reset, submitting } = props
  return (
    <Card className="CreateUserForm-card">
      <div>
<h2>          Please enter the details of the new user</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <Field 
          className="CreateUserForm-field"
          name="email"
          component={renderInput}
          label="Email"
          validate={[required]}
          warn={email}
        />
      </div>
      <div>
        <Field
          className="CreateUserForm-field"
          name="password"
          component={renderInput}
          label=""
          validate={[required]}
        />
      </div>
      <div>
        <Field
          className="CreateUserForm-field"
          name="first_name"
          component={renderInput}
          label="First Name"
        />
      </div>
      <div>
        <Field
          className="CreateUserForm-field"
          name="last_name"
          component={renderInput}
          label="Last Name"
        />
      </div>
      <div>
        <Field
          className="CreateUserForm-field"
          name="comments"
          component={renderInput}
          label="Comments"
        />
      </div>
      <div>
        <Field
          className="CreateUserForm-field"
          name="state"
          component={renderUserStateMenu}
          label="State"/>
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