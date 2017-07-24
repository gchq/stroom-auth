import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'

import Card, { CardActions, CardContent } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu'
import { TextField } from 'redux-form-material-ui'

import { required, email } from '../../validations'

import CreateUserForm from '../createUser'
import UserStateMenu from '../userStateMenu'
import UserFields from '../userFields'
import {saveChanges} from '../../modules/user'

import './EditUser.css'

const UserEditForm = props => {
  const {saveChanges, pristine, submitting, showCalculatedFields } = props
  return (
    <Card >
      <form onSubmit={saveChanges}>

          <h2>Update the user's details below</h2>
          <UserFields showCalculatedFields={true}/>

            <RaisedButton 
            primary={true} className="User-button" 
            disabled={pristine || submitting}
            type="submit">
              Update the user
          </RaisedButton>
      </form>
    </Card>
  )
}

const ReduxUserEditForm = reduxForm({
  form: 'UserEditForm'
})(UserEditForm)


const mapStateToProps = state => ({
  initialValues: state.user.userBeingEdited
})

const mapDispatchToProps = dispatch => bindActionCreators({
  saveChanges
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserEditForm)