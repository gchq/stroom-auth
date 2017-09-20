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

import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { NavLink } from 'react-router-dom'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {fullWhite} from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import Toggle from 'material-ui/Toggle'
import Dialog from 'material-ui/Dialog'
import {blue600, amber900} from 'material-ui/styles/colors'
import Paper from 'material-ui/Card'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import Add from 'material-ui-icons/Add'
import Delete from 'material-ui-icons/Delete'
import Edit from 'material-ui-icons/Edit'
import Help from 'material-ui-icons/Help'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'

import UserSearch from '../userSearch'
import UserCreate from '../createUser'
import UserEdit from '../editUser'
import { deleteSelectedUser, toggleAlertVisibility } from '../../modules/user'
import { relativePath } from '../../relativePush'

import './User.css'

class UserLayout extends Component {
  constructor() {
    super()
    this.state = {
      isFilteringEnabled: false,
      isHelpDialogOpen: false
    }
  }

  deleteSelectedUser(){
    this.context.store.dispatch(deleteSelectedUser())
  }

  toggleFiltering(isFilteringEnabled){
    this.setState({isFilteringEnabled})
  }

  handleHelpDialogOpen = () => {
    this.setState({isHelpDialogOpen: true});
  };

  handleHelpDialogClose = () => {
    this.setState({isHelpDialogOpen: false});
  };

  render() {
    const { show, selectedUserRowId, showAlert, alertText, toggleAlertVisibility } = this.props
    var showSearch = show === 'search'
    var showCreate = show === 'create'
    var showEdit = show === 'edit'
    var showCreateButton = showSearch 
    var deleteButtonDisabled = selectedUserRowId ? false : true
    return (
      <Paper className='UserLayout-main' zDepth={0}>
        <Toolbar>
          <ToolbarGroup>
            <NavLink to={relativePath('/userSearch')}>
              <ToolbarTitle text="Users" className="UserLayout-toolbarTitle"/>
            </NavLink>
            {showCreate || showEdit ? (<KeyboardArrowRight className="UserLayout-toolbarSeparator"/>) : (undefined)}
            {showCreate ? (<ToolbarTitle text="Create" className="UserLayout-toolbarTitle"/>) : (undefined)}
            {showEdit ? (<ToolbarTitle text="Edit" className="UserLayout-toolbarTitle"/>) : (undefined)}
          </ToolbarGroup>
          <ToolbarGroup>

            {showSearch ? (
              <div className="UserLayout-toolbarButton">
                <Toggle
                  label="Show filtering"
                  labelPosition="right"
                  onToggle= {(event, isFilteringEnabled)=> this.toggleFiltering(isFilteringEnabled)}/>
              </div>
            ) : (undefined)}

            {showCreateButton ? (
              <div className="UserLayout-toolbarButton">
                <NavLink to={relativePath('/newUser')}>
                  <RaisedButton label="Create" primary={true} className="UserSearch-appButton" 
                    icon={<Add color={fullWhite}/>}/>
                </NavLink>
              </div>
            ) : (undefined)}

            {showSearch ? (
              <div className="UserLayout-toolbarButton">
                <NavLink to={relativePath(`/user/${selectedUserRowId}`)}>
                  <RaisedButton label="Edit" primary={true}
                    icon={<Edit color={fullWhite}/>} disabled={deleteButtonDisabled}/>
                </NavLink>
              </div>
            ) : (undefined)}

            {showSearch ? (
              <div className="UserLayout-toolbarButton">
                <RaisedButton label="Delete" primary={true} 
                  icon={<Delete color={fullWhite}/>} disabled={deleteButtonDisabled}
                  onClick={() => this.deleteSelectedUser()}/>
              </div>
            ) : (undefined)}

            <IconButton onClick={() => this.handleHelpDialogOpen()}>
              <Help color={blue600} hoverColor={amber900}/>
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <div className="User-content">
          {showSearch ? (<UserSearch isFilteringEnabled={this.state.isFilteringEnabled}/>) : (undefined)}
          {showCreate ? (<UserCreate/>) : (undefined)}
          {showEdit ? (<UserEdit/>) : (undefined)}
        </div>
        <Snackbar
          open={showAlert}
          message={alertText}
          autoHideDuration={4000}
          onRequestClose={() => toggleAlertVisibility()}
        />
        <Dialog
          title={<div><span><Help color={blue600}/></span> &nbsp;<span>Users</span></div>}
          actions={
            <FlatButton
              label="OK"
              primary={true}
              onTouchTap={this.handleHelpDialogClose}/>}
          modal={false}
          open={this.state.isHelpDialogOpen}
          onRequestClose={this.handleHelpDialogClose}>
          <p>This area is for managing user accounts.</p>
          <p>The list of users here do not include those who might have logged in using certificates or LDAP credentials.</p>
        </Dialog>
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