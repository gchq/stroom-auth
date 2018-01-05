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
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import Toggle from 'material-ui/Toggle'
import Dialog from 'material-ui/Dialog'
import { blue600, amber900, fullWhite } from 'material-ui/styles/colors'
import Paper from 'material-ui/Card'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import Add from 'material-ui-icons/Add'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'
import Help from 'material-ui-icons/Help'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'

import TokenSearch from '../tokenSearch'
import TokenCreate from '../tokenCreate'
import TokenEdit from '../tokenEdit'
import { deleteSelectedToken, toggleAlertVisibility } from '../../modules/token'
import { relativePath } from '../../relativePush'

import '../../styles/index.css'
import '../../styles/toolbar-small.css'
import '../../styles/toggle-small.css'

class TokenLayout extends Component {
  constructor () {
    super()
    this.state = {
      isFilteringEnabled: false,
      isHelpDialogOpen: false
    }
  }

  deleteToken () {
    this.context.store.dispatch(deleteSelectedToken())
  }

  toggleFiltering (isFilteringEnabled) {
    this.setState({isFilteringEnabled})
  }

  handleHelpDialogOpen () {
    this.setState({isHelpDialogOpen: true})
  }

  handleHelpDialogClose () {
    this.setState({isHelpDialogOpen: false})
  }

  render () {
    const { show, selectedTokenRowId, showAlert, alertText, toggleAlertVisibility } = this.props
    const showSearch = show === 'search'
    const showCreate = show === 'create'
    const showEdit = show === 'edit'
    const showCreateButton = showSearch
    const showEditButton = showSearch
    const deleteButtonDisabled = !selectedTokenRowId
    const editButtonDisabled = !selectedTokenRowId
    return (
      <Paper className='Layout-main' zDepth={0}>
        <Toolbar className='toolbar-small'>
          <ToolbarGroup>
            { /* <NavLink to={relativePath('/')}>
              <Home />
            </NavLink>
    <KeyboardArrowRight /> */ }
            <NavLink to={relativePath('/tokens')}>
              <ToolbarTitle text='API keys' className='toolbar-title-small' />
            </NavLink>
            {showCreate ? (<KeyboardArrowRight />) : (undefined)}
            {showCreate ? (<ToolbarTitle text='Create' className='UserLayout-toolbarTitle' />) : (undefined)}
          </ToolbarGroup>
          <ToolbarGroup>

            {showSearch ? (
              <Toggle
                className='toggle-small toggle-small-low'
                label='Show filtering'
                labelPosition='right'
                onToggle={(event, isFilteringEnabled) => this.toggleFiltering(isFilteringEnabled)} />
            ) : (undefined)}

            {showCreateButton ? (
              <NavLink to={relativePath('/token/newApiToken')}>
                <RaisedButton label='Create' primary className='toolbar-button-small'
                  icon={<Add color={fullWhite} />} />
              </NavLink>
            ) : (undefined)}

            {showEditButton ? (
              <NavLink to={relativePath(`/token/${selectedTokenRowId}`)}>
                <RaisedButton label='View/Edit' primary className='toolbar-button-small'
                  disabled={editButtonDisabled}
                  icon={<Edit color={fullWhite} />} />
              </NavLink>
            ) : (undefined)}

            {showSearch ? (
              <div>
                <RaisedButton label='Delete' primary
                  icon={<Delete color={fullWhite} />} disabled={deleteButtonDisabled}
                  onClick={() => this.deleteToken()}
                  className='toolbar-button-small' />
              </div>
            ) : (undefined)}

            <IconButton onClick={() => this.handleHelpDialogOpen()}>
              <Help color={blue600} hoverColor={amber900} />
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
        <div className='User-content'>
          {showSearch ? (<TokenSearch isFilteringEnabled={this.state.isFilteringEnabled} />) : (undefined)}
          {showCreate ? (<TokenCreate />) : (undefined)}
          {showEdit ? (<TokenEdit />) : (undefined)}
        </div>
        <Snackbar
          open={showAlert}
          message={alertText}
          autoHideDuration={4000}
          onRequestClose={() => toggleAlertVisibility('')}
        />
        <Dialog
          title={<div><span><Help color={blue600} /></span> &nbsp;<span>API Keys</span></div>}
          actions={
            <FlatButton
              label='OK'
              primary
              onTouchTap={() => this.handleHelpDialogClose()} />}
          modal={false}
          open={this.state.isHelpDialogOpen}
          onRequestClose={() => this.handleHelpDialogClose()}>
          <p>This area is for managing API keys.</p>
          <p>An API token is issued to a user so they may create an application that integrates with Stroom.</p>
        </Dialog>
      </Paper>

    )
  }
}

TokenLayout.contextTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  show: state.token.show,
  selectedTokenRowId: state.tokenSearch.selectedTokenRowId,
  showAlert: state.token.showAlert,
  alertText: state.token.alertText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteSelectedToken,
  toggleAlertVisibility
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TokenLayout)
