import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink} from 'react-router-dom'

import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import RaisedButton from 'material-ui/RaisedButton'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import IconButton from 'material-ui/IconButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'

import { performUserSearch } from '../../modules/userSearch'
import './UserSearch.css'

const columns = [{
  Header: 'Actions',
  accessor: 'id',
  Cell: row => (
    <NavLink to={`/user/${row.value}`}><IconButton className='UserSearch-tableButton'><ImageEdit/></IconButton></NavLink>
  )
}, {
  Header: 'Email',
  accessor: 'email'
}, {
  Header: 'State',
  accessor: 'state'
}, {
  Header: 'Last login',
  accessor: 'last_ogin'
}, {
  Header: 'Login failures',
  accessor: 'login_failures'
}, {
  Header: 'Updated by',
  accessor: 'updated_by_user'
}, {
  Header: 'Updated',
  accessor: 'updated_on'
}, {
  Header: 'Comments',
  accessor: 'comments'
}]

class UserSearch extends Component {
  componentDidMount() {
    this.props.performUserSearch(this.props.token)
  }

  render() {
    return (
          <Paper className='UserSearch-main'>
            <Toolbar>
              <ToolbarGroup>
                <ToolbarTitle text="Users" />
              </ToolbarGroup>
              <ToolbarGroup>
                <NavLink to='/newUser'>
                  <RaisedButton label="Create" primary={true} className="UserSearch-appButton"/>
                </NavLink>
              </ToolbarGroup>
            </Toolbar>
            <div className="UserSearch-content">
              <div>
                <ReactTable
                  data={this.props.results}
                  className='-striped -highlight UserSearch-table'
                  columns={columns}
                  defaultSorted={[{
                    id:'email',
                    desc: true
                  }]}
                  showPagination={false}
                  filterable={true}
                  loading={this.props.showSearchLoader}/>
                <p className="warning">This list is for user accounts only. It excludes those users who might have logged in using certificates or LDAP credentials.</p>
              </div>
            </div>
          </Paper>    
    )
  }
}

const mapStateToProps = state => ({
  token: state.login.token,
  showSearchLoader: state.userSearch.showSearchLoader,
  results: state.userSearch.results,
  errorStatus: state.user.errorStatus,
  errorText: state.user.errorText
})

const mapDispatchToProps = dispatch => bindActionCreators({
  performUserSearch
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSearch)