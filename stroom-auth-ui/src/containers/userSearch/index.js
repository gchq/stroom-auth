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

import Toggle from 'material-ui/Toggle'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

import dateFormat from 'dateformat'

import './UserSearch.css'
import '../../styles/table-small.css'

import { performUserSearch, changeSelectedRow } from '../../modules/userSearch'

class UserSearch extends Component {
  constructor() {
      super()
    this.state = {
      isFilteringEnabled: false,
    }
  }

  componentDidMount () {
    this.props.performUserSearch(this.props.token)
  }

  toggleRow (id) {
    // Tell the redux store so the control buttons get displayed correctly
    this.props.changeSelectedRow(id)
  }

  renderStateCell (state) {
    let stateColour, stateText
    switch (state) {
      case 'enabled':
        stateColour = '#57d500'
        stateText = 'Active'
        break
      case 'locked':
        stateColour = '#ff2e00'
        stateText = 'Locked'
        break
      case 'disabled':
        stateColour = '#ff2e00'
        stateText = 'Inactive'
        break
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

  getStateCellFilter (filter, onChange) {
    return (
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: '100%' }}
        value={filter ? filter.value : 'all'}
      >
        <option value=''>Show all</option>
        <option value='enabled'>Active only</option>
        <option value='locked'>Locked only</option>
        <option value='disabled'>Inactive only</option>
      </select>
    )
  }

  formatDate (dateString) {
    const dateFormatString = 'ddd mmm d yyyy, hh:MM:ss'
    return dateString ? dateFormat(dateString, dateFormatString) : ''
  }

  filterRow(row, filter){
    var index = row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase())
    return index >= 0
  }

  getColumnFormat () {
    return [{
      Header: '',
      accessor: 'id',
      Cell: row => (<div>{this.props.selectedUserRowId === row.value ? 'selected' : 'unselected'}</div>),
      filterable: false,
      show: false
    }, {
      Header: 'Email',
      accessor: 'email',
      maxWidth: 190,
      filterMethod: (filter, row) => this.filterRow(row, filter)
    }, {
      Header: 'Account status',
      accessor: 'state',
      maxWidth: 100,
      Cell: row => this.renderStateCell(row.value),
      Filter: ({filter, onChange}) => this.getStateCellFilter(filter, onChange)
    }, {
      Header: 'Last login',
      accessor: 'last_login',
      Cell: row => this.formatDate(row.value),
      maxWidth: 165,
      filterable: false
    }, {
      Header: 'Login failures',
      accessor: 'login_failures',
      maxWidth: 100
    }, {
      Header: 'Comments',
      accessor: 'comments',
      filterMethod: (filter, row) => this.filterRow(row, filter)
    }]
  }

  toggleFiltering (event) {
    const isFilteringEnabled = event.target.checked
    this.setState({isFilteringEnabled})
  }

  render () {
    const { selectedUserRowId } = this.props
    const { isFilteringEnabled } = this.state
    const deleteButtonDisabled = !selectedUserRowId
    return (
      <div className='UserSearch-main' zDepth={0}>
        <div className='header'>
             <NavLink to={'/newUser'} >
                <button className='toolbar-button-small'>Create</button>
              </NavLink>
               {deleteButtonDisabled ? (
                <div>
                  <button className='toolbar-button-small'
                    disabled >View/edit</button>
                </div>
              ) : (
                <NavLink to={`/user/${selectedUserRowId}`} >
                  <button className='toolbar-button-small'>View/edit</button>
                </NavLink>
              ) }

              <div>
                <button 
                  disabled={deleteButtonDisabled}
                  onClick={() => this.deleteSelectedUser()}
                  className='toolbar-button-small'>Delete</button>
              </div>
              <div className='UserSearch-filteringToggle'>
            <label>Enable filtering?</label> 
           <input 
             type='checkbox'
             value={isFilteringEnabled}
             className='toggle-small toggle-small-low'
             checked={isFilteringEnabled}
             onChange={(event) => this.toggleFiltering(event)}/>

</div> 

        </div>
        <div className='UserSearch-content' >
             
          <div className='table-small-container'>
            <ReactTable
              data={this.props.results}
              className='-striped -highlight UserSearch-table'
              columns={this.getColumnFormat()}
              defaultSorted={[{
                id: 'email',
                desc: true
              }]}
              filterable={isFilteringEnabled}
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
              getTheadProps={() => {
                return {
                  className: 'table-row-small'
                }
              }}
              getTrProps={(state, rowInfo) => {
                let selected = false
                if (rowInfo) {
                  selected = rowInfo.row.id === this.props.selectedUserRowId
                }
                return {
                  onClick: (target, event) => {
                    this.toggleRow(rowInfo.row.id)
                  },
                  className: selected ? 'table-row-small table-row-selected' : 'table-row-small'
                }
              }} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.authentication.idToken,
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
