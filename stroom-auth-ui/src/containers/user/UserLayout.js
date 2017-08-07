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
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'

import UserSearch from '../userSearch'
import UserCreate from '../createUser'
import UserEdit from '../editUser'

import Paper from 'material-ui/Card'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'

import './User.css'

const UserLayout = props => {
  const { show } = props
  var showSearch = show === 'search'
  var showCreate = show === 'create'
  var showEdit = show === 'edit'
  var showCreateButton = showSearch || showEdit
  var showSearchButton = showEdit || showCreate
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
          <NavLink to='/newUser'>
            <RaisedButton label="Create" primary={true} className="UserSearch-appButton" icon={<Add color={fullWhite}/>}/>
          </NavLink>
          ) : (undefined)}
          {showSearchButton ? (
          <NavLink to='/userSearch'>
            <RaisedButton label="Search" primary={true} className="UserSearch-appButton" icon={<Search color={fullWhite}/>}/>
          </NavLink>
          ) : (undefined)}
        </ToolbarGroup>
      </Toolbar>
      <div className="User-content">
        {showSearch ? (<UserSearch/>) : (undefined)}
        {showCreate ? (<UserCreate/>) : (undefined)}
        {showEdit ? (<UserEdit/>) : (undefined)}
      </div>
    </Paper> 
  )
}

const mapStateToProps = state => ({
  show: state.user.show
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLayout)