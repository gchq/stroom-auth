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

import * as React from "react";
import { useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css"
import "rc-checkbox/assets/index.css";
import ReactTable, {
  RowRenderProps,
  ReactTableFunction,
  RowInfo,
  Column
} from "react-table";
import "react-table/react-table.css";
import * as dateFormat from "dateformat";
// import { Checkbox } from 'pretty-checkbox-react';

import Button from "../Button";
import "./TokenSearch.css";
import "../../styles/index.css";
import "../../styles/toolbar-small.css";
import "../../styles/table-small.css";
import "../../styles/toggle-small.css";
import { useTokens, useApi as useTokenApi } from "../../api/tokens";
import {
  useApi as useTokenSearchApi,
  useActionCreators as useTokenSearchActionCreators
} from "../../api/tokenSearch";
import { useReduxState } from "../../lib/useReduxState";
import { useRouter } from "../../lib/useRouter";
// FIXME: Not sure why the actual filter props isn't working
type FilterProps = {
  filter: any;
  onChange: ReactTableFunction;
};

const getColumnFormat = (
  selectedTokenRowId: string | undefined,
  setEnabledStateOnToken: Function
) => {
  return [
    {
      Header: "",
      accessor: "id",
      Cell: (row: RowInfo): React.ReactNode => (
        <div>
          {selectedTokenRowId === row.row.value ? "selected" : "unselected"}
        </div>
      ),
      filterable: false,
      show: false
    },
    {
      Header: "User",
      accessor: "user_email",
      maxWidth: 190
    },
    {
      Header: "Enabled",
      accessor: "enabled",
      maxWidth: 80,
      Cell: (row: RowInfo) =>
        getEnabledCellRenderer(row, setEnabledStateOnToken),
      Filter: ({ filter, onChange }: FilterProps) =>
        getEnabledCellFilter(filter, onChange)
    },
    {
      Header: "Expires on",
      accessor: "expires_on",
      Cell: (row: RowInfo) => formatDate(row.row.value),
      Filter: ({ filter, onChange }: FilterProps) => undefined, // Disable filtering by this column - how do we filter on dates?
      maxWidth: 165
    },
    {
      Header: "Issued on",
      accessor: "issued_on",
      Cell: (row: RowInfo) => formatDate(row.row.value),
      Filter: ({ filter, onChange }: FilterProps) => undefined, // Disable filtering by this column - how do we filter on dates?
      maxWidth: 165
    }
  ] as Column[];
};

const getEnabledCellRenderer = (
  row: RowRenderProps,
  setEnabledStateOnToken: Function
) => {
  const state = row.original.enabled;
  const tokenId = row.original.id;
  return (
    <div
      className="TokenSearch__table__checkbox"
      // onClick={() => setEnabledStateOnToken(tokenId, !state)}
    >
    <input type="checkbox" checked={state} onChange={() => setEnabledStateOnToken(tokenId, !state)}/>
      {/* <Toggle icons={false} checked={state} onChange={() => setEnabledStateOnToken(tokenId, !state)}/> */}
    </div>
  );
};

const getEnabledCellFilter = (filter: any, onChange: Function) => {
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
  );
};

const formatDate = (dateString: string) => {
  const dateFormatString = "ddd mmm d yyyy, hh:MM:ss";
  return dateString ? dateFormat(dateString, dateFormatString) : "";
};

const TokenSearch = () => {
  const {
    showSearchLoader,
    results,
    totalPages,
    selectedTokenRowId,
    pageSize
  } = useReduxState(
    ({
      tokenSearch: {
        showSearchLoader,
        results,
        totalPages,
        selectedTokenRowId,
        lastUsedPageSize
      }
    }) => ({
      showSearchLoader,
      results,
      totalPages,
      selectedTokenRowId,
      pageSize: lastUsedPageSize
    })
  );
  const {toggleEnabledState} = useTokens();
  const { history } = useRouter();
  const { performTokenSearch } = useTokenSearchApi();
  const { selectRow } = useTokenSearchActionCreators();
  const { deleteSelectedToken} = useTokenApi();

  const [isFilteringEnabled, toggleFiltering] = useState(false);
  const noTokenSelected = !selectedTokenRowId;
  return (
     <div className="Layout-main">
       <div className="User-content" id="User-content">
    <div className="UserSearch-main">
      <div className="header">
        <Button
          className="toolbar-button-small primary"
          onClick={() => history.push("/token/newApiToken")}
          icon="plus"
          text="Create"
        />

        {noTokenSelected ? (
          <div>
            <Button
              className="toolbar-button-small primary"
              disabled={noTokenSelected}
              icon="edit"
              text="View/edit"
            />
          </div>
        ) : (
          <Button
            className="toolbar-button-small primary"
            disabled={noTokenSelected}
            onClick={() => history.push(`/token/${selectedTokenRowId}`)}
            icon="edit"
            text="View/edit"
          />
        )}

        <div>
          <Button
            disabled={noTokenSelected}
            onClick={() => deleteSelectedToken()}
            className="toolbar-button-small primary"
            icon="trash"
            text="Delete"
          />
        </div>

        <div className="UserSearch-filteringToggle">
          <label>Show filtering</label>
          <Toggle
            icons={false}
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
              toggleEnabledState
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
              height: "calc(100vh - 50px)"
            }}
            getTheadTrProps={() => {
              return {
                className: "table-header-small"
              };
            }}
            getTrProps={(state: any, rowInfo: RowInfo) => {
              let selected = false;
              let enabled = true;
              if (rowInfo) {
                selected = rowInfo.row.id === selectedTokenRowId;
                enabled = rowInfo.row.enabled;
              }

              let className = "table-row-small";
              className += selected ? " table-row-selected" : "";
              className += enabled ? "" : " table-row-dimmed";
              return {
                onClick: (target: any, event: any) => {
                  selectRow(rowInfo.row.id);
                },
                className
              };
            }}
            onFetchData={(state, instance) => {
              performTokenSearch(
                state.pageSize,
                state.page,
                state.sorted,
                state.filtered
              );
            }}
          />
        </div>
      </div>
    </div>
       </div>
     </div>
  );
};

export default TokenSearch;
