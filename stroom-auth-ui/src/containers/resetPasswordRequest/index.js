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
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import { Field } from 'redux-form'

import { TextField } from 'redux-form-material-ui'

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import './ResetPasswordRequest.css'
import '../Layout.css'
import { required } from '../../validations'
import { submitPasswordChangeRequest as onSubmit } from '../../modules/user'

const ResetPasswordRequest = props => {
  const {handleSubmit, pristine, submitting } = props;
  return (
    <div className='content-floating-without-appbar'>
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
    </div>
  )
};

const ReduxResetPasswordRequestForm = reduxForm({
  form: 'ResetPasswordRequestForm'
})(ResetPasswordRequest);

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxResetPasswordRequestForm)