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
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {compose, withState} from 'recompose';
import {push} from 'react-router-redux';
import * as moment from 'moment';

import Button from '../../Button';
import './TokenSearch.css';
import '../../../styles/table-small.css';
import '../../../styles/toggle-small.css';
import {
  performTokenSearch,
  changeSelectedRow,
  setEnabledStateOnToken,
} from '../../../modules/tokenSearch';
import {deleteSelectedToken} from '../../../modules/token';

const DISPLAY_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
moment.updateLocale("en", {
  invalidDate: "No date"
});

function getColumnFormat(selectedTokenRowId, setEnabledStateOnToken) {
  return [
    {
      Header: '',
      accessor: 'id',
      Cell: row => (
        <div>
          {selectedTokenRowId === row.value ? 'selected' : 'unselected'}
        </div>
      ),
      filterable: false,
      show: false,
    },
    {
      Header: 'User',
      accessor: 'user_email',
      maxWidth: 190,
    },
    {
      Header: 'Enabled',
      accessor: 'enabled',
      maxWidth: 80,
      Cell: row => getEnabledCellRenderer(row, setEnabledStateOnToken),
      Filter: ({filter, onChange}) => getEnabledCellFilter(filter, onChange),
    },
    {
      Header: 'Expires on',
      accessor: 'expires_on',
      Cell: row => moment(row.value).format(DISPLAY_DATE_TIME_FORMAT),
      Filter: ({filter, onChange}) => undefined, // Disable filtering by this column - how do we filter on dates?
      maxWidth: 195,
    },
    {
      Header: 'Issued on',
      accessor: 'issued_on',
      Cell: row => moment(row.value).format(DISPLAY_DATE_TIME_FORMAT),
      Filter: ({filter, onChange}) => undefined, // Disable filtering by this column - how do we filter on dates?
      maxWidth: 195,
    },
  ];
}

function getEnabledCellRenderer(row, setEnabledStateOnToken) {
  const state = row.value ? 1 : 0;
  const tokenId = row.original.id;
  return (
    <div
      className="TokenSearch__table__checkbox"
      onClick={() => setEnabledStateOnToken(tokenId, !state)}>
      <Checkbox defaultChecked={state} checked={state} />
    </div>
  );
}

function getEnabledCellFilter(filter, onChange) {
  return (
    <select
      onChange={event => onChange(event.target.value)}
      style={{width: '100%'}}
      value={filter ? filter.value : 'all'}>
      <option value="">Show all</option>
      <option value="true">Enabled only</option>
      <option value="false">Disabled only</option>
    </select>
  );
}

const enhance = compose(
  connect(
    ({
      authentication: {idToken},
      tokenSearch: {
        showSearchLoader,
        results,
        totalPages,
        errorStatus,
        errorText,
        selectedTokenRowId,
        lastUsedPageSize,
      },
    }) => ({
      idToken,
      showSearchLoader,
      results,
      totalPages,
      errorStatus,
      errorText,
      selectedTokenRowId,
      pageSize: lastUsedPageSize,
    }),
    {
      performTokenSearch,
      deleteSelectedToken,
      changeSelectedRow,
      setEnabledStateOnToken,
      push,
    },
  ),
  withState('isFilteringEnabled', 'toggleFiltering', false),
);

const TokenSearch = ({
  // vars
  selectedTokenRowId,
  results,
  totalPages,
  showSearchLoader,
  pageSize,
  isFilteringEnabled,
  idToken,
  //funcs
  performTokenSearch,
  setEnabledStateOnToken,
  changeSelectedRow,
  deleteSelectedToken,
  toggleFiltering,
  push,
}) => {
  const noTokenSelected = !selectedTokenRowId;
  return (
    <div className="UserSearch-main">
      <div className="header">
        <Button
          className="toolbar-button-small primary"
          onClick={() => push('/s/token/newApiToken')}
          icon="plus">
          Create
        </Button>

        {noTokenSelected ? (
          <div>
            <Button
              className="toolbar-button-small primary"
              disabled={noTokenSelected}
              icon="edit">
              View/edit
            </Button>
          </div>
        ) : (
          <Button
            className="toolbar-button-small primary"
            disabled={noTokenSelected}
            onClick={() => push(`/s/token/${selectedTokenRowId}`)}
            icon="edit">
            View/edit
          </Button>
        )}

        <div>
          <Button
            disabled={noTokenSelected}
            onClick={() => deleteSelectedToken()}
            className="toolbar-button-small primary"
            icon="trash">
            Delete
          </Button>
        </div>

        <div className="UserSearch-filteringToggle">
          <label>Show filtering</label>
          <Checkbox
            checked={isFilteringEnabled}
            onChange={event => toggleFiltering(event.target.checked)}
          />
        </div>
      </div>
      <div className="UserSearch-content">
        <div className="table-small-container">
          <ReactTable
            data={results}
            pages={totalPages}
            manual
            className="-striped -highlight UserSearch-table"
            columns={getColumnFormat(
              selectedTokenRowId,
              setEnabledStateOnToken,
            )}
            filterable={isFilteringEnabled}
            showPagination
            showPageSizeOptions={false}
            loading={showSearchLoader}
            defaultPageSize={pageSize}
            pageSize={pageSize}
            style={{
              // We use 'calc' because we want full height but need
              // to account for the header. Obviously if the header height
              // changes this offset will need to change too.
              height: 'calc(100vh - 50px)',
            }}
            getTheadTrProps={() => {
              return {
                className: 'table-header-small',
              };
            }}
            getTrProps={(state, rowInfo) => {
              let selected = false;
              let enabled = true;
              if (rowInfo) {
                selected = rowInfo.row.id === selectedTokenRowId;
                enabled = rowInfo.row.enabled;
              }

              let className = 'table-row-small';
              className += selected ? ' table-row-selected' : '';
              className += enabled ? '' : ' table-row-dimmed';
              return {
                onClick: (target, event) => {
                  changeSelectedRow(rowInfo.row.id);
                },
                className,
              };
            }}
            onFetchData={(state, instance) => {
              performTokenSearch(
                idToken,
                state.pageSize,
                state.page,
                state.sorted,
                state.filtered,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default enhance(TokenSearch);