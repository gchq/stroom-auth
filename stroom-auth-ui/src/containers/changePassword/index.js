import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import { Field } from 'redux-form'

import { TextField } from 'redux-form-material-ui'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import './ChangePassword.css'
import { required } from '../../validations'
import { changePasswordForCurrentUser as onSubmit, toggleAlertVisibility } from '../../modules/user'

const ChangePassword = props => {
    const {handleSubmit, pristine, submitting, showAlert, alertText, toggleAlertVisibility } = props
    return (
      <Card className="ChangePassword-main">
        <div>
            <p>You can change your password below.</p>
            <form onSubmit={handleSubmit}>
                
            <Field 
                className="ChangePassword-field"
                name="password"
                type="password"
                component={TextField}
                validate={[required]}/>
                <br/>
            <RaisedButton 
                className="ChangePassword-button"
                primary={true} 
                disabled={pristine || submitting}
                type="submit"
                label="Change password"/>
            </form>

            <Snackbar
                open={showAlert}
                message={alertText}
                autoHideDuration={4000}
                onRequestClose={() => toggleAlertVisibility()}
            />
        </div>
      </Card>
    )
}


const ReduxChangePassword = reduxForm({
  form: 'ChangePasswordForm'
})(ChangePassword)

const mapStateToProps = state => ({
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
)(ReduxChangePassword)