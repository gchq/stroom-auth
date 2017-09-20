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

import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import './CreateUserForm.css'
import '../Layout.css'
import UserFields from '../userFields'
import { createUser as onSubmit } from '../../modules/user'

const UserCreateForm = props => {
  const {handleSubmit, pristine, submitting } = props;
  return (
    <div className=''>
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
    </div>
  )
};

const ReduxUserCreateForm = reduxForm({
  form: 'UserCreateForm'
})(UserCreateForm);

const mapStateToProps = state => ({
  // token: state.login.token,
  showCreateLoader: state.user.showCreateLoader,
  // email: state.user.email,
  // password: state.user.password,
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onSubmit
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserCreateForm)