import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import UserFields from '../userFields'
import {saveChanges as onSubmit} from '../../modules/user'

import './EditUser.css'

const UserEditForm = props => {
  const {handleSubmit, pristine, submitting } = props
  return (
    <Card className="EditUserForm-card">
      <form onSubmit={handleSubmit}>
          <UserFields showCalculatedFields={true}/>
          <RaisedButton 
            primary={true}
            disabled={pristine || submitting}
            type="submit">
              Update the user
          </RaisedButton>
      </form>
    </Card>
  )
}

const ReduxUserEditForm = reduxForm({
  form: 'UserEditForm'
})(UserEditForm)


const mapStateToProps = state => ({
  initialValues: state.user.userBeingEdited
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserEditForm)