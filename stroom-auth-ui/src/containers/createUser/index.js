import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import './CreateUserForm.css'
import UserFields from '../userFields'
import { createUser as onSubmit } from '../../modules/user'

const UserCreateForm = props => {
  const {handleSubmit, pristine, submitting } = props
  return (
    <Card className="CreateUserForm-card">
      <div>
        <form onSubmit={handleSubmit}>
          <UserFields showCalculatedFields={false} constrainPasswordEditing={false}/>
          <div>
          <RaisedButton 
            primary={true} 
            disabled={pristine || submitting}
            type="submit"
            label="Create the user"/>
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