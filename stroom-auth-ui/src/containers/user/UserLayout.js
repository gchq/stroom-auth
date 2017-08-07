import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes, { object } from 'prop-types'


import { bindActionCreators } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { NavLink } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'
import {fullWhite} from 'material-ui/styles/colors'
import Add from 'material-ui-icons/Add'
import Search from 'material-ui-icons/Search'
import Delete from 'material-ui-icons/Delete'
import Edit from 'material-ui-icons/Edit'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import Snackbar from 'material-ui/Snackbar'

import UserSearch from '../userSearch'
import UserCreate from '../createUser'
import UserEdit from '../editUser'
import { deleteSelectedUser, toggleAlertVisibility } from '../../modules/user'

import Paper from 'material-ui/Card'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

import './User.css'

class UserLayout extends Component {
  deleteUser(){
    this.context.store.dispatch(deleteSelectedUser())
  }

  render() {
    const { show, selectedUserRowId, showAlert, alertText, toggleAlertVisibility } = this.props
    var showSearch = show === 'search'
    var showCreate = show === 'create'
    var showEdit = show === 'edit'
    var showCreateButton = showSearch || showEdit
    var showSearchButton = showEdit || showCreate
    var deleteButtonDisabled = selectedUserRowId ? false : true
    return (
      <Paper className='UserLayout-main'>
        <Toolbar>
          <ToolbarGroup>
            <NavLink to='/userSearch'>
              <ToolbarTitle text="Users" className="UserLayout-toolbarTitle"/>
            </NavLink>
            <KeyboardArrowRight className="UserLayout-toolbarSeparator"/>
            {showSearch ? (<ToolbarTitle text="Search" className="UserLayout-toolbarTitle"/>) : (undefined)}
            {showCreate ? (<ToolbarTitle text="Create" className="UserLayout-toolbarTitle"/>) : (undefined)}
            {showEdit ? (<ToolbarTitle text="Edit" className="UserLayout-toolbarTitle"/>) : (undefined)}
          </ToolbarGroup>
          <ToolbarGroup>

            {showCreateButton ? (
              <div className="UserLayout-toolbarButton">
                <NavLink to='/newUser'>
                  <RaisedButton label="Create" primary={true} className="UserSearch-appButton" 
                    icon={<Add color={fullWhite}/>}/>
                </NavLink>
              </div>
            ) : (undefined)}

            {showSearch ? (
              <div className="UserLayout-toolbarButton">
                <RaisedButton label="Delete" primary={true} 
                  icon={<Delete color={fullWhite}/>} disabled={deleteButtonDisabled}
                  onClick={(param1, param2) => this.deleteUser(param1, param2)}/>
              </div>
            ) : (undefined)}

            {showSearch ? (
              <div className="UserLayout-toolbarButton">
                <NavLink to={`/user/${selectedUserRowId}`}>
                  <RaisedButton label="Edit" primary={true}
                    icon={<Edit color={fullWhite}/>} disabled={deleteButtonDisabled}/>
                </NavLink>
              </div>
            ) : (undefined)}


            {showSearchButton ? (
              <div className="UserLayout-toolbarButton">
                <NavLink to='/userSearch'>
                  <RaisedButton label="Search" primary={true} className="UserSearch-appButton" 
                    icon={<Search color={fullWhite}/>} />
                </NavLink>
              </div>
            ) : (undefined)}

          </ToolbarGroup>
        </Toolbar>
        <div className="User-content">
          {showSearch ? (<UserSearch/>) : (undefined)}
          {showCreate ? (<UserCreate/>) : (undefined)}
          {showEdit ? (<UserEdit/>) : (undefined)}
        </div>
        <Snackbar
          open={showAlert}
          message={alertText}
          autoHideDuration={4000}
          onRequestClose={() => toggleAlertVisibility()}
        />
      </Paper> 

    )
  }
}

UserLayout.contextTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  show: state.user.show,
  selectedUserRowId: state.userSearch.selectedUserRowId,
  showAlert: state.user.showAlert,
  alertText: state.user.alertText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteSelectedUser,
  toggleAlertVisibility
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLayout)