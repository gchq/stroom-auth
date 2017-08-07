import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import { required } from '../../validations'

import { changePasswordForCurrentUser as onSubmit, togglePasswordChangedMessageVisibility } from '../../modules/user'
import './ChangePassword.css'

const ChangePassword = props => {
    const {handleSubmit, pristine, submitting, togglePasswordChangedMessageVisibility, showPasswordChangedMessage } = props
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
                open={showPasswordChangedMessage}
                message="Your password has been changed"
                autoHideDuration={4000}
                onRequestClose={() => togglePasswordChangedMessageVisibility()}
            />
        </div>
      </Card>
    )
}


const ReduxChangePassword = reduxForm({
  form: 'ChangePasswordForm'
})(ChangePassword)

const mapStateToProps = state => ({
    showPasswordChangedMessage: state.user.showPasswordChangedMessage
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit, 
  togglePasswordChangedMessageVisibility
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxChangePassword)