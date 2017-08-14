import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink} from 'react-router-dom'
import PropTypes from 'prop-types'

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

import dateFormat from 'dateformat'

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

  renderStateCell(state){
    var stateColour, stateText
    switch(state) {
      case 'enabled':
        stateColour = '#57d500'
        stateText = 'Enabled'
        break;
      case 'locked':
        stateColour = '#ff2e00'
        stateText = 'Locked'
        break;
      case 'disabled':
        stateColour = '#ff2e00'
        stateText = 'Disabled'
        break;
      default:
        stateColour = '#ffbf00'
        stateText = 'Unknown!'
    }
    return (
      <span>
        <span style={{
          color: stateColour,
          transition: 'all .3s ease'
        }}>
          &#x25cf;
        </span> {
          stateText
        }
      </span>
    )
  }

  formatDate(dateString){
    const dateFormatString = 'ddd mmm d yyyy, hh:MM:ss'
    return dateString ? dateFormat(dateString, dateFormatString) : ''
  }

  getColumnFormat() {
    const columns = [{
      Header: '',
      accessor: 'id',
      Cell: row => (<div>{this.props.selectedUserRowId === row.value ? 'selected' : 'unselected'}</div>),
      width: 30,
      filterable: false,
      show: false
    }, {
      Header: 'Email',
      accessor: 'email',
      width: 200
    }, {
      Header: 'State',
      accessor: 'state',
      width: 100,
      Cell: row => this.renderStateCell(row.value)
    }, {
      Header: 'Last login',
      accessor: 'last_login',
      Cell: row => this.formatDate(row.value),
      width: 225
    }, {
      Header: 'Login failures',
      accessor: 'login_failures',
      width: 120
    }, {
      Header: 'Updated by',
      accessor: 'updated_by_user',
      width: 200
    }, {
      Header: 'Updated on',
      accessor: 'updated_on',
      Cell: row => this.formatDate(row.value),
      width: 220
    }, {
      Header: 'Comments',
      accessor: 'comments',
      width: 400
    }]
    return columns
  }

  render() {
    return (
      <Paper className='UserSearch-main' zDepth="0">
        <div className="UserSearch-content" >
          <div>
              <ReactTable
                data={this.props.results}
                className='-striped -highlight UserSearch-table'
                columns={this.getColumnFormat()}
                defaultSorted={[{
                  id:'email',
                  desc: true
                }]}
                filterable={this.props.isFilteringEnabled}
                showPagination= {true}
                loading={this.props.showSearchLoader}
                getTrProps={(state, rowInfo, column, instance) => {
                  var selected = false
                  if(rowInfo) {
                    selected = rowInfo.row.id === this.props.selectedUserRowId 
                  }
                  return {
                    onClick: (target, event) => {
                      this.toggleRow(rowInfo.row.id)
                    },
                    className: selected ? 'selectedRow' : 'unselectedRow'
                  }
                }}/>
          </div>
        </div>
      </Paper>    
    )
  }
}

UserSearch.propTypes = {
  isFilteringEnabled: PropTypes.bool.isRequired
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