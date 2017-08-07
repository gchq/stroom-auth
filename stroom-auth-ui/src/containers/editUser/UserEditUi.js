import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import UserFields from '../userFields'
import {saveChanges as onSubmit, toggleAlertVisibility} from '../../modules/user'

import './EditUser.css'

const UserEditForm = props => {
  const {handleSubmit, pristine, submitting, alertText, showAlert, toggleAlertVisibility } = props
  return (
    <Card className="EditUserForm-card">
      <form onSubmit={handleSubmit}>
          <UserFields showCalculatedFields={true} constrainPasswordEditing={true}/>
          <RaisedButton 
            primary={true}
            disabled={pristine || submitting}
            type="submit"
            label="Update the user"/>
      </form>
      <Snackbar
        open={showAlert}
        message={alertText}
        autoHideDuration={4000}
        onRequestClose={() => toggleAlertVisibility()}
      />
    </Card>
  )
}

const ReduxUserEditForm = reduxForm({
  form: 'UserEditForm'
})(UserEditForm)


const mapStateToProps = state => ({
  initialValues: state.user.userBeingEdited,
  showAlert: state.user.showAlert,
  alertText: state.user.alertText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit,
  toggleAlertVisibility
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserEditForm)