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
import '../../styles/table-small.css'
import '../../styles/toggle-small.css'
import { performTokenSearch, changeSelectedRow, setEnabledStateOnToken } from '../../modules/tokenSearch'

// TODO change the CSS references from 'User' - maybe make the CSS common?
class TokenSearch extends Component {
  toggleRow (id) {
    // Tell the redux store so the control buttons get displayed correctly
    this.props.changeSelectedRow(id)
  }

  fetchTokens (securityToken, state) {
    this.props.performTokenSearch(securityToken, state.pageSize, state.page, state.sorted, state.filtered)
  }

  getEnabledCellRenderer (row) {
    let state = row.value
    let tokenId = row.original.id
    return (
      <Toggle
        className='toggle-small  toggle-small-high'
        defaultToggled={state}
        onToggle={(_, isEnabled) => this.props.setEnabledStateOnToken(tokenId, isEnabled)}
        />
    )
  }

  getEnabledCellFilter (filter, onChange) {
    return (
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : 'all'}
      >
        <option value=''>Show all</option>
        <option value='true'>Enabled only</option>
        <option value='false'>Disabled only</option>
      </select>
    )
  }

  formatDate (dateString) {
    const dateFormatString = 'ddd mmm d yyyy, hh:MM:ss'
    return dateString ? dateFormat(dateString, dateFormatString) : ''
  }

  getColumnFormat () {
    return [{
      Header: '',
      accessor: 'id',
      Cell: row => (<div>{this.props.selectedTokenRowId === row.value ? 'selected' : 'unselected'}</div>),
      filterable: false,
      show: false
    }, {
      Header: 'User',
      accessor: 'user_email',
      maxWidth: 190
    }, {
      Header: 'Enabled',
      accessor: 'enabled',
      maxWidth: 80,
      Cell: row => this.getEnabledCellRenderer(row),
      Filter: ({filter, onChange}) => this.getEnabledCellFilter(filter, onChange)
    }, {
      Header: 'Expires on',
      accessor: 'expires_on',
      Cell: row => this.formatDate(row.value),
      Filter: ({filter, onChange}) => undefined, // Disable filtering by this column - how do we filter on dates?
      maxWidth: 165
    }, {
      Header: 'Issued on',
      accessor: 'issued_on',
      Cell: row => this.formatDate(row.value),
      Filter: ({filter, onChange}) => undefined, // Disable filtering by this column - how do we filter on dates?
      maxWidth: 165
    }]
  }

  render () {
    return (
      <Paper className='UserSearch-main' zDepth={0}>
        <div className='UserSearch-content' >
          <div className='table-small-container'>
            <ReactTable
              data={this.props.results}
              pages={this.props.totalPages}
              manual
              className='-striped -highlight UserSearch-table'
              columns={this.getColumnFormat()}
              filterable={this.props.isFilteringEnabled}
              showPagination
              loading={this.props.showSearchLoader}
              defaultPageSize={50}
              style={{
                // We use 'calc' because we want full height but need
                // to account for the header. Obviously if the header height
                // changes this offset will need to change too.
                height: 'calc(100vh - 40px)'
              }}
              getTheadTrProps={() => {
                return {
                  className: 'table-header-small'
                }
              }}
              getTrProps={(state, rowInfo) => {
                let selected = false
                if (rowInfo) {
                  selected = rowInfo.row.id === this.props.selectedTokenRowId
                }
                return {
                  onClick: (target, event) => {
                    this.toggleRow(rowInfo.row.id)
                  },
                  className: selected ? 'table-row-small table-row-selected' : 'table-row-small'
                }
              }}
              onFetchData={(state, instance) => {
                  // TODO call to show the loading state
                this.fetchTokens(this.props.idToken, state)
              }} />
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
  idToken: state.authentication.idToken,
  showSearchLoader: state.tokenSearch.showSearchLoader,
  results: state.tokenSearch.results,
  totalPages: state.tokenSearch.totalPages,
  pages: state.tokenSearch.totalPages,
  errorStatus: state.token.errorStatus,
  errorText: state.token.errorText,
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
