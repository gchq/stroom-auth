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

import React from 'react';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import {compose, withProps, withState, lifecycle} from 'recompose';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import dateFormat from 'dateformat';
import {push} from 'react-router-redux';

import './UserSearch.css';
import '../../../styles/table-small.css';
import {deleteSelectedUser} from '../../../modules/user';
import {
  performUserSearch,
  changeSelectedRow,
} from '../../../modules/userSearch';

function filterRow(row, filter) {
  var index = row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase());
  return index >= 0;
}

function renderStateCell(state) {
  let stateColour, stateText;
  switch (state) {
    case 'enabled':
      stateColour = '#57d500';
      stateText = 'Active';
      break;
    case 'locked':
      stateColour = '#ff2e00';
      stateText = 'Locked';
      break;
    case 'disabled':
      stateColour = '#ff2e00';
      stateText = 'Inactive';
      break;
    default:
      stateColour = '#ffbf00';
      stateText = 'Unknown!';
  }
  return (
    <span>
      <span
        style={{
          color: stateColour,
          transition: 'all .3s ease',
        }}>
        &#x25cf;
      </span>{' '}
      {stateText}
    </span>
  );
}

function getStateCellFilter(filter, onChange) {
  return (
    <select
      onChange={event => onChange(event.target.value)}
      style={{width: '100%'}}
      value={filter ? filter.value : 'all'}>
      <option value="">Show all</option>
      <option value="enabled">Active only</option>
      <option value="locked">Locked only</option>
      <option value="disabled">Inactive only</option>
    </select>
  );
}

function formatDate(dateString) {
  const dateFormatString = 'ddd mmm d yyyy, hh:MM:ss';
  return dateString ? dateFormat(dateString, dateFormatString) : '';
}

function getColumnFormat(selectedUserRowId) {
  return [
    {
      Header: '',
      accessor: 'id',
      Cell: row => (
        <div>{selectedUserRowId === row.value ? 'selected' : 'unselected'}</div>
      ),
      filterable: false,
      show: false,
    },
    {
      Header: 'Email',
      accessor: 'email',
      maxWidth: 190,
      filterMethod: (filter, row) => filterRow(row, filter),
    },
    {
      Header: 'Account status',
      accessor: 'state',
      maxWidth: 100,
      Cell: row => renderStateCell(row.value),
      Filter: ({filter, onChange}) => getStateCellFilter(filter, onChange),
    },
    {
      Header: 'Last login',
      accessor: 'last_login',
      Cell: row => formatDate(row.value),
      maxWidth: 165,
      filterable: false,
    },
    {
      Header: 'Login failures',
      accessor: 'login_failures',
      maxWidth: 100,
    },
    {
      Header: 'Comments',
      accessor: 'comments',
      filterMethod: (filter, row) => filterRow(row, filter),
    },
  ];
}

const enhance = compose(
  connect(
    ({
      authentication: {idToken},
      userSearch: {showSearchLoader, results, selectedUserRowId},
      user: {errorStatus, errorText},
    }) => ({
      idToken,
      showSearchLoader,
      results,
      selectedUserRowId,
      errorStatus,
      errorText,
    }),
    {deleteSelectedUser, performUserSearch, changeSelectedRow, push},
  ),
  lifecycle({
    componentDidMount() {
      const {performUserSearch, idToken} = this.props;
      performUserSearch(idToken);
    },
  }),
  withState('isFilteringEnabled', 'setFilteringEnabled', false),
  withProps(({selectedUserRowId}) => {
    return {
      deleteButtonDisabled: !selectedUserRowId,
    };
  }),
);

const UserSearch = ({
  selectedUserRowId,
  deleteSelectedUser,
  isFilteringEnabled,
  setFilteringEnabled,
  changeSelectedRow,
  results,
  showSearchLoader,
  deleteButtonDisabled,
  push,
}) => {
  return (
    <div className="UserSearch-main">
      <div className="header">
        <button
          className="toolbar-button-small primary"
          onClick={() => '/newUser'}>
          <FontAwesomeIcon icon="plus" /> Create
        </button>
        {deleteButtonDisabled ? (
          <div>
            <button className="toolbar-button-small primary" disabled>
              <FontAwesomeIcon icon="edit" /> View/edit
            </button>
          </div>
        ) : (
          <button
            className="toolbar-button-small primary"
            onClick={() => `/user/${selectedUserRowId}`}>
            <FontAwesomeIcon icon="edit" /> View/edit
          </button>
        )}

        <div>
          <button
            disabled={deleteButtonDisabled}
            onClick={() => deleteSelectedUser()}
            className="toolbar-button-small primary">
            <FontAwesomeIcon icon="trash" /> Delete
          </button>
        </div>
        <div className="UserSearch-filteringToggle">
          <label>Show filtering</label>
          <Checkbox
            checked={isFilteringEnabled}
            onChange={event => setFilteringEnabled(event.target.checked)}
          />
        </div>
      </div>
      <div className="UserSearch-content">
        <div className="table-small-container">
          <ReactTable
            data={results}
            className="-striped -highlight UserSearch-table"
            columns={getColumnFormat(selectedUserRowId)}
            defaultSorted={[
              {
                id: 'email',
                desc: true,
              },
            ]}
            filterable={isFilteringEnabled}
            showPagination
            loading={showSearchLoader}
            defaultPageSize={50}
            style={{
              // We use 'calc' because we want full height but need
              // to account for the header. Obviously if the header height
              // changes this offset will need to change too.
              height: 'calc(100vh - 40px)',
            }}
            getTheadTrProps={() => {
              return {
                className: 'table-header-small',
              };
            }}
            getTheadProps={() => {
              return {
                className: 'table-row-small',
              };
            }}
            getTrProps={(state, rowInfo) => {
              let selected = false;
              if (rowInfo) {
                selected = rowInfo.row.id === selectedUserRowId;
              }
              return {
                onClick: (target, event) => {
                  changeSelectedRow(rowInfo.row.id);
                },
                className: selected
                  ? 'table-row-small table-row-selected'
                  : 'table-row-small',
              };
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default enhance(UserSearch);
