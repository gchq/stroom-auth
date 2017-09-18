import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import dateFormat from 'dateformat'

import './TokenSearch.css'
import { performTokenSearch, changeSelectedRow, setEnabledStateOnToken } from '../../modules/tokenSearch'

//TODO change the CSS references from 'User' - maybe make the CSS common?
class TokenSearch extends Component {

  toggleRow(id) {
    // Tell the redux store so the control buttons get displayed correctly
    this.props.changeSelectedRow(id)
  }

  fetchTokens(securityToken, state) {
    this.props.performTokenSearch(securityToken, state)
  }

  getEnabledCellRenderer(row){
    let state = row.value
    let tokenId = row.original.id
    return (
        <Toggle
            defaultToggled={state}
            onToggle={(_, isEnabled) => this.props.setEnabledStateOnToken(tokenId, isEnabled)}
        />
    )
  }

  getEnabledCellFilter(filter, onChange){
    return (
      <select
          onChange={event => onChange(event.target.value)}
          style={{ width: "100%" }}
          value={filter ? filter.value : "all"}
      >
        <option value="">Show all</option>
        <option value="true">Enabled only</option>
        <option value="false">Disabled only</option>
      </select>
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
      Cell: row => (<div>{this.props.selectedTokenRowId === row.value ? 'selected' : 'unselected'}</div>),
      width: 30,
      filterable: false,
      show: false
    }, {
      Header: 'User',
      accessor: 'user_email',
      width: 200
    }, {
      Header: 'Enabled',
      accessor: 'enabled',
      width: 130,
      Cell: row => this.getEnabledCellRenderer(row),
      Filter:({filter, onChange}) => this.getEnabledCellFilter(filter, onChange)
    }, {
      Header: 'Expires on',
      accessor: 'expires_on',
      Cell: row => this.formatDate(row.value),
      width: 225
    }, {
      Header: 'Issued on',
      accessor: 'issued_on',
      Cell: row => this.formatDate(row.value),
      width: 120
    }, {
      Header: 'Token',
      accessor: 'token',
      width: 200
    }, {
      Header: 'Token type',
      accessor: 'token_type',
      width: 220
    }, {
      Header: 'Updated by user',
      accessor: 'updated_by_user',
      width: 400
    }, {
      Header: 'Updated on',
      accessor: 'updated_on',
      Cell: row => this.formatDate(row.value),
      width: 400
    }]
    return columns
  }

  render() {
    return (
      <Paper className='UserSearch-main' zDepth={0}>
        <div className="UserSearch-content" >
          <div>
              <ReactTable
                data={this.props.results}
                pages={this.props.pages}
                manual
                className='-striped -highlight UserSearch-table'
                columns={this.getColumnFormat()}
                // defaultSorted={[{
                //   id:'email',
                //   desc: true
                // }]}
                // TODO: tie this to this.props.isFilteringEnabled
                filterable={true}
                showPagination= {true}
                loading={this.props.showSearchLoader}
                getTrProps={(state, rowInfo, column, instance) => {
                  var selected = false
                  if(rowInfo) {
                    selected = rowInfo.row.id === this.props.selectedTokenRowId
                  }
                  return {
                    onClick: (target, event) => {
                      this.toggleRow(rowInfo.row.id)
                    },
                    className: selected ? 'selectedRow' : 'unselectedRow'
                  }
                }}
                onFetchData={(state, instance) => {
                  //TODO call to show the loading state
                  this.fetchTokens(this.props.token, state)
                }}/>
          </div>
        </div>
      </Paper>    
    )
  }
}

TokenSearch.propTypes = {
  isFilteringEnabled: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  token: state.login.token,
  showSearchLoader: state.tokenSearch.showSearchLoader, //TODO wire this in
  results: state.tokenSearch.results,
  errorStatus: state.token.errorStatus, //TODO wire this in
  errorText: state.token.errorText, // TODO wire this in
  selectedTokenRowId: state.tokenSearch.selectedTokenRowId 
})

const mapDispatchToProps = dispatch => bindActionCreators({
  performTokenSearch,
  changeSelectedRow,
  setEnabledStateOnToken
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TokenSearch)