import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes, {object} from 'prop-types'

import Card, { CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Avatar from 'material-ui/Avatar'

import './Login.css'
import icon from '../../icon.png'
import { required, email } from '../../validations'
import {login as onSubmit} from '../../modules/login'

const LoginForm = props => {
  const {handleSubmit, pristine, submitting } = props
    return (
      <div>
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
              <br/>
              <br/>
              <RaisedButton 
                primar={true}
                disabled={pristine || submitting}
                type="submit"
                fullWidth={true}>
                  Log in
              </RaisedButton>
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