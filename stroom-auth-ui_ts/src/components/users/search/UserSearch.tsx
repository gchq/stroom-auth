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

import "rc-checkbox/assets/index.css";
import "react-table/react-table.css";
import "react-toggle/style.css";
import * as React from "react";
import ReactTable, { RowInfo } from "react-table";
import Toggle from "react-toggle";

import "../../../styles/table-small.css";
import "./UserSearch.css";
import Button from "../../Button";
import useRouter from "../../../lib/useRouter";
import useUserSearch from "./useUserSearch";
import { useState } from "react";
import { getColumnFormat } from "./tableCustomisations";

const UserSearch = () => {
  const [isFilteringEnabled, setFilteringEnabled] = useState(false);
  const { users, selectedUser, remove, changeSelectedUser } = useUserSearch();
  const { history } = useRouter();
  const deleteButtonDisabled = !selectedUser;

  return (
    <div className="UserSearch-main">
      <div className="header">
        <Button
          className="toolbar-button-small primary"
          onClick={() => history.push("/newUser")}
          icon="plus"
          text="Create"
        />
        {deleteButtonDisabled ? (
          <div>
            <Button
              className="toolbar-button-small primary"
              disabled
              icon="edit"
              text="View/edit"
            />
          </div>
        ) : (
          <Button
            className="toolbar-button-small primary"
            onClick={() => history.push(`/user/${selectedUser}`)}
            icon="edit"
            text="View/edit"
          />
        )}

        <div>
          <Button
            disabled={deleteButtonDisabled}
            onClick={() => {
              if (!!selectedUser) {
                remove(selectedUser);
              }
            }}
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
            data={users}
            className="-striped -highlight UserSearch-table"
            columns={getColumnFormat(selectedUser)}
            defaultSorted={[
              {
                id: "email",
                desc: true
              }
            ]}
            filterable={isFilteringEnabled}
            showPagination
            // loading={showSearchLoader} //TODO
            defaultPageSize={50}
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
            getTheadProps={() => {
              return {
                className: "table-row-small"
              };
            }}
            getTrProps={(state: any, rowInfo: RowInfo) => {
              let selected = false;
              if (rowInfo) {
                selected = rowInfo.row.id === selectedUser;
              }
              return {
                onClick: (target: any, event: any) => {
                  changeSelectedUser(rowInfo.row.id);
                },
                className: selected
                  ? "table-row-small table-row-selected"
                  : "table-row-small"
              };
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
