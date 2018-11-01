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
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Checkbox from 'rc-checkbox'
import 'rc-checkbox/assets/index.css';



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
 constructor() {
      super()
    this.state = {
      isFilteringEnabled: false,
    }
  } 
    
    toggleRow (id) {
    // Tell the redux store so the control buttons get displayed correctly
    this.props.changeSelectedRow(id)
  }

  fetchTokens (securityToken, state) {
    this.props.performTokenSearch(securityToken, state.pageSize, state.page, state.sorted, state.filtered)
  }
  toggleFiltering (event) {
    const isFilteringEnabled = event.target.checked
    this.setState({isFilteringEnabled})
  }

  getEnabledCellRenderer (row) {
    let state = row.value
    let tokenId = row.original.id
    return (       <div className='TokenSearch__table__checkbox'> <Checkbox defaultChecked={state}
                                                onChange={(event) => this.props.setEnabledStateOnToken(tokenId, !state)}/>
</div>
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
      const { selectedTokenRowId } = this.props
      const noTokenSelected = !selectedTokenRowId
     const { isFilteringEnabled } = this.state
   return (
      <div className='UserSearch-main'>
        <div className='header'>
              <NavLink to={'/token/newApiToken'}>
                <button className='toolbar-button-small'><FontAwesomeIcon icon='plus'/> Create</button>
              </NavLink>

            {
               noTokenSelected ? (
                <div>
                  <button className='toolbar-button-small'
                    disabled={noTokenSelected}><FontAwesomeIcon icon='edit'/> View/edit</button>
                </div>
              ) : (
                <NavLink to={`/token/${selectedTokenRowId}`}>
                  <button className='toolbar-button-small'
                    disabled={noTokenSelected}><FontAwesomeIcon icon='edit'/> View/edit</button>
                </NavLink>
              ) }

              <div>
                <button
                   disabled={noTokenSelected}
                  onClick={() => this.deleteToken()}
                  className='toolbar-button-small' ><FontAwesomeIcon icon="trash"/> Delete</button>
              </div>

              <div className='UserSearch-filteringToggle'>
                       <label>Show filtering</label> 
                      <Checkbox
                        checked={isFilteringEnabled}
                        onChange={(event) => this.toggleFiltering(event)}/>
           </div> 

        </div>
        <div className='UserSearch-content'>
          <div className='table-small-container'>
            <ReactTable
              data={this.props.results}
              pages={this.props.totalPages}
              manual
              className='-striped -highlight UserSearch-table'
              columns={this.getColumnFormat()}
              filterable={isFilteringEnabled}
              showPagination
              showPageSizeOptions={false}
              loading={this.props.showSearchLoader}
              defaultPageSize={this.props.pageSize}
              pageSize={this.props.pageSize}
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
      </div>
    )
  }
}

const mapStateToProps = state => ({
  idToken: state.authentication.idToken,
  showSearchLoader: state.tokenSearch.showSearchLoader,
  results: state.tokenSearch.results,
  totalPages: state.tokenSearch.totalPages,
  pages: state.tokenSearch.totalPages,
  errorStatus: state.token.errorStatus,
  errorText: state.token.errorText,
  selectedTokenRowId: state.tokenSearch.selectedTokenRowId,
  pageSize: state.tokenSearch.lastUsedPageSize
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
