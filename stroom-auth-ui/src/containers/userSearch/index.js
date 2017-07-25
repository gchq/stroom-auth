import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink} from 'react-router-dom'

import Paper from 'material-ui/Paper'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import RaisedButton from 'material-ui/RaisedButton'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import IconButton from 'material-ui/IconButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'
import {fullWhite} from 'material-ui/styles/colors'
import Add from 'material-ui-icons/Add'

import { performUserSearch } from '../../modules/userSearch'
import './UserSearch.css'

const columns = [{
  Header: '',
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
    //TODO Need to detect changes in height and put it into the store, then read it. That way it'll change when the window resizes.
    const innerHeight = window.innerHeight
    const appBarHeight = 200
    const tableHeight = innerHeight - appBarHeight
    return (
      <Paper className='UserSearch-main'>
        <div className="UserSearch-content" >
          <div>
            <ReactTable
              data={this.props.results}
              className='-striped -highlight UserSearch-table'
              style={{height: tableHeight}}
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