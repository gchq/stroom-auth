import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'

import { Field, reduxForm } from 'redux-form'
import { TextField, Checkbox } from 'redux-form-material-ui'

import './Login.css'
import icon from '../../icon.png'
import { required, email } from '../../validations'
import {login as onSubmit} from '../../modules/login'

const LoginForm = props => {
  const {handleSubmit, pristine, submitting } = props
    return (
      <div className='LoginForm-container'>
        <Card className='Login-card'>
          <form onSubmit={handleSubmit}>
            <div>
              <div className="LoginForm-iconContainer">
                <Avatar
                  className="LoginForm-icon"
                  src={icon}
                  size={100}
                />
              </div>
              <div>
              <Field 
                name="email"
                component={TextField}
                hintText="Email"
                validate={[required]}
                warn={email}
                className="LoginForm-input"
              />
              </div>
              <Field 
                name="password"
                component={TextField}
                hintText="Password"
                validate={[required]}
                className="LoginForm-input"
              />
              <Field
                name="rememberMe"
                component={Checkbox}
                label="Remember me?"
                className="LoginForm-input"
              />
              <br/>
              <br/>
              <RaisedButton 
                primary={true}
                disabled={pristine || submitting}
                type="submit"
                fullWidth={true}
                label="Sign in"/>
            </div>
          </form>
        </Card>
      </div>
    )
  }

const ReduxLoginForm = reduxForm({
  form: 'LoginForm'
})(LoginForm)

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxLoginForm)