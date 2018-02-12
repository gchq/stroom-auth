/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'

import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import './Login.css'
import '../Layout.css'
import icon from '../../icon.png'
import { required } from '../../validations'
import { login as onSubmit } from '../../modules/login'

const LoginForm = props => {
  const { handleSubmit, pristine, submitting } = props
  return (
    <div className='content-floating-without-appbar'>
      <Card className='Login-card'>
        <form onSubmit={handleSubmit}>
          <div>
            <div className='LoginForm-iconContainer'>
              <Avatar
                className='LoginForm-icon'
                src={icon}
                size={100}
                />
            </div>
            <div>
              <Field
                name='email'
                component={TextField}
                hintText='Email'
                validate={[required]}
                className='LoginForm-input'
              />
            </div>
            <Field
              name='password'
              component={TextField}
              hintText='Password'
              validate={[required]}
              className='LoginForm-input'
              type='password'
              />
            <br />
            <RaisedButton
              primary
              disabled={pristine || submitting}
              type='submit'
              fullWidth
              label='Sign in' />
            <br />
            <NavLink to={'/resetPasswordRequest'}><p className='LoginForm-resetPasswordText'>Reset password?</p></NavLink>
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
