import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink} from 'react-router-dom'

import Paper from 'material-ui/Paper'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import IconButton from 'material-ui/IconButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'
import {fullWhite} from 'material-ui/styles/colors'
import Add from 'material-ui-icons/Add'

import { performUserSearch, changeSelectedRow } from '../../modules/userSearch'
import './UserSearch.css'


class UserSearch extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.performUserSearch(this.props.token)
  }

  toggleRow(id) {
    // Tell the redux store so the control buttons get displayed correctly
    this.props.changeSelectedRow(id)
  }

  render() {

    const columns = [{
      Header: '',
      accessor: 'id',
      Cell: row => (
        <Checkbox checked={this.props.selectedUserRowId === row.value}/>
      )
    }, {
      Header: 'Email',
      accessor: 'email'
    }, {
      Header: 'State',
      accessor: 'state'
    }, {
      Header: 'Last login',
      accessor: 'last_login'
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
                loading={this.props.showSearchLoader}
                getTrProps={(state, rowInfo, column, instance) => {
                  return {
                    onClick: (target, event) => {
                      this.toggleRow(rowInfo.row.id)
                    }
                  }
                }}/>
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
  errorText: state.user.errorText,
  selectedUserRowId: state.userSearch.selectedUserRowId
})

const mapDispatchToProps = dispatch => bindActionCreators({
  performUserSearch,
  changeSelectedRow
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSearch)