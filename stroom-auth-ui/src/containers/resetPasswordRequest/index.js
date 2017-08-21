import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import { Field } from 'redux-form'

import { TextField } from 'redux-form-material-ui'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import './ResetPasswordRequest.css'
import { required } from '../../validations'
import { submitPasswordChangeRequest as onSubmit } from '../../modules/user'

const ResetPasswordRequest = props => {
    const {handleSubmit, pristine, submitting, showAlert, alertText, toggleAlertVisibility } = props
    return (
      <Card className="ResetPasswordRequest-main">
        <div>
            <p>Please enter your email address below.</p>
            <form onSubmit={handleSubmit}>
                
            <Field 
                className="ResetPasswordRequest-field"
                name="emailAddress"
                component={TextField}
                validate={[required]}/>
                <br/>
            <RaisedButton 
                className="ResetPasswordRequest-button"
                primary={true} 
                disabled={pristine || submitting}
                type="submit"
                label="Send me a reset email"/>
            </form>
        </div>
      </Card>
    )
}

const ReduxResetPasswordRequestForm = reduxForm({
  form: 'ResetPasswordRequestForm'
})(ResetPasswordRequest)

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxResetPasswordRequestForm)