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
import "react-toggle/style.css";
import "rc-checkbox/assets/index.css";
import ReactTable, { RowInfo } from "react-table";
import "react-table/react-table.css";

import "src/styles/index.css";
import "src/styles/table-small.css";
import "src/styles/toggle-small.css";
import "src/styles/toolbar-small.css";
import Button from "src/components/Button";
import { useRouter } from "src/lib/useRouter";

import "./TokenSearch.css";
import useTokenSearch from './useTokenSearch';
import { getColumnFormat } from './tableCustomisations';

const TokenSearch = () => {
  const {
    deleteSelectedToken,
    performTokenSearch,
    setSelectedTokenRowId,
    selectedTokenRowId,
    results,
    totalPages,
    searchConfig,
    toggleState } = useTokenSearch();
  const { history } = useRouter();

  const [isFilteringEnabled, setFilteringEnabled] = useState(false);
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
                onChange={event => setFilteringEnabled(event.target.checked)}
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
                columns={getColumnFormat(selectedTokenRowId, toggleState)}
                filterable={isFilteringEnabled}
                showPagination
                showPageSizeOptions={false}
                // loading={showSearchLoader}
                defaultPageSize={searchConfig.pageSize}
                pageSize={searchConfig.pageSize}
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
                    onClick: () => {
                      setSelectedTokenRowId(rowInfo.row.id);
                    },
                    className
                  };
                }}
                onFetchData={(state) => {
                  performTokenSearch({
                    pageSize: state.pageSize,
                    page: state.page,
                    sorting: state.sorted,
                    filters: state.filtered
                  });
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
