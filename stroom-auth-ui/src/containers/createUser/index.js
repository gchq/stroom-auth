import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { MenuItem } from 'material-ui/Menu'
import { SelectField, TextField } from 'redux-form-material-ui'

import UserFields from '../userFields'
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
          <UserFields/>
          <div>
          <RaisedButton 
            primary={true} className="User-button" 
            disabled={pristine || submitting}
            type="submit">
              Create the user
          </RaisedButton>
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
  // token: state.login.token,
  showCreateLoader: state.user.showCreateLoader,
  // email: state.user.email,
  // password: state.user.password,
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