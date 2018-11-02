 /*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use  file except in compliance with the License.
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

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import { NavLink } from 'react-router-dom'
import PropTypes, { object } from 'prop-types'
import { compose, lifecycle, withProps, withHandlers } from "recompose";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AutoComplete } from 'redux-form-material-ui'
import Card from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import { Formik, Form, withFormik  } from 'formik'
import { useDispatch } from 'redux-react-hook'
import AsyncUserSelect from '../userSelect'
import './CreateTokenForm.css'
import '../Layout.css'
import { createToken as onSubmit, userAutoCompleteChange } from '../../modules/token'


const enhance = compose(connect(
    ({
        authentication: {idToken},
        token: { matchingAutoCompleteResults, errorMessage}
    }) => ({
        idToken, matchingAutoCompleteResults, errorMessage
    }),
    {
        userAutoCompleteChange, onSubmit
    }
),
);

const TokenCreateForm = props => {
    const { 
        onSubmit
    } = props
    return (
        <div className='CreateTokenForm-card'>
     <Formik
        onSubmit={(values, actions) => {
   onSubmit(values.user.label, actions.setSubmitting)
      actions.setSubmitting(false)
        }}
        render={props => (
            <form onSubmit={props.handleSubmit}>
        <div className='header'>
          <button
                  type='submit'><FontAwesomeIcon icon='plus'/> Create API key</button>
                <NavLink to='/tokens'>
                  <button>Cancel</button>
                </NavLink>
 </div>
              <div className='left-container'>
                <div className='field-container'>
                  <div className='label-container'>
                    <label>User's email</label>
                  </div>
                  <div className='input-container'>
                  <AsyncUserSelect 
                    onChange={props.setFieldValue}/>                    
                  </div>
                </div>
              </div>
              <div className='CreateTokenForm-errorMessage'> {props.errorMessage}</div>
            </form>
        )}/>
        </div>
    )
  }

export default enhance(TokenCreateForm)
