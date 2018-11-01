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
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './EditUser.css'
import UserFields from '../userFields'
import {saveChanges as onSubmit, toggleAlertVisibility} from '../../modules/user'

const UserEditForm = props => {
  const { handleSubmit, pristine, submitting, alertText, showAlert, toggleAlertVisibility } = props
  return (
      <div>
      <form onSubmit={handleSubmit}>
        <div className='header'>
         <button
          className='toolbar-button-small'
          disabled={pristine || submitting}
          type='submit'
         ><FontAwesomeIcon icon='save'/> Save</button>
        <NavLink to='/userSearch'>
          <button className='toolbar-button-small'><FontAwesomeIcon icon='times'/> Cancel</button>
        </NavLink>
      </div>
        <UserFields showCalculatedFields constrainPasswordEditing />
      </form>
    </div>
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
