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
import * as React from "react";
import * as dateFormat from "dateformat";
import ReactTable, { RowInfo, ReactTableFunction } from "react-table";
import Toggle from "react-toggle";

import "../../../styles/table-small.css";
import "./UserSearch.css";
import Button from "../../Button";
import useReduxState from "../../../lib/useReduxState";
import useRouter from "../../../lib/useRouter";
import useUsers from '../../../api/userSearch/useUsers';
import { useActionCreators as useUserSearchActionCreators } from "../../../api/userSearch";
import { useApi as useUsersApi } from "../../../api/users";
import { useState } from "react";

// FIXME: Not sure why the actual filter props isn't working
type FilterProps = {
  filter: any;
  onChange: ReactTableFunction;
};

const getColumnFormat = (selectedUserRowId: string | undefined) => {
  return [
    {
      Header: "",
      accessor: "id",
      Cell: (row: RowInfo) => (
        <div>
          {selectedUserRowId === row.row.value ? "selected" : "unselected"}
        </div>
      ),
      filterable: false,
      show: false
    },
    {
      Header: "Email",
      accessor: "email",
      maxWidth: 190,
      filterMethod: (filter:any, row:any) => filterRow(row, filter)
    },
    {
      Header: "Account status",
      accessor: "state",
      maxWidth: 100,
      Cell: (row: RowInfo) => renderStateCell(row.row.state),
      Filter: ({ filter, onChange }: FilterProps) => getStateCellFilter(filter, onChange)
    },
    {
      Header: "Last login",
      accessor: "last_login",
      Cell: (row: RowInfo) => formatDate(row.row.value),
      maxWidth: 165,
      filterable: false
    },
    {
      Header: "Login failures",
      accessor: "login_failures",
      maxWidth: 100
    },
    {
      Header: "Comments",
      accessor: "comments",
      filterMethod: (filter:any, row:any) => filterRow(row, filter)
    }
  ];
};

const filterRow = (row:any, filter:any) => {
  var index = row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase());
  return index >= 0;
};

const renderStateCell = (state:string) => {
  let stateColour, stateText;
  switch (state) {
    case "enabled":
      stateColour = "#57d500";
      stateText = "Active";
      break;
    case "locked":
      stateColour = "#ff2e00";
      stateText = "Locked";
      break;
    case "disabled":
      stateColour = "#ff2e00";
      stateText = "Disabled";
      break;
    case "inactive":
      stateColour = "#ff2e00";
      stateText = "Inactive";
      break;
    default:
      stateColour = "#ffbf00";
      stateText = "Unknown!";
  }
  return (
    <span>
      <span
        style={{
          color: stateColour,
          transition: "all .3s ease"
        }}
      >
        &#x25cf;
      </span>{" "}
      {stateText}
    </span>
  );
};

const getStateCellFilter = (filter:any, onChange:Function) => {
  return (
    <select
      onChange={event => onChange(event.target.value)}
      style={{ width: "100%" }}
      value={filter ? filter.value : "all"}
    >
      <option value="">Show all</option>
      <option value="enabled">Active only</option>
      <option value="locked">Locked only</option>
      <option value="disabled">Inactive only</option>
    </select>
  );
};

const formatDate = (dateString:string) => {
  const dateFormatString = "ddd mmm d yyyy, hh:MM:ss";
  return dateString ? dateFormat(dateString, dateFormatString) : "";
};

const UserSearch = () => {
  const [isFilteringEnabled, setFilteringEnabled] = useState(false);
  const { deleteSelectedUser } = useUsersApi();
  // const { getUsers } = useUserSearchApi();
  // const { performUserSearch } = useUserSearchApi();
  const { selectRow } = useUserSearchActionCreators();
  const { history } = useRouter();
  const {
    showSearchLoader,
    results,
    selectedUserRowId,
  } = useReduxState(
    ({
      userSearch: { showSearchLoader, results, selectedUserRowId },
      user: { errorStatus, errorText }
    }) => ({
      showSearchLoader,
      results,
      selectedUserRowId,
      errorStatus,
      errorText
    })
  );

  const {users} = useUsers();
console.log({users});
  // const store = useContext(StoreContext);
  // const thing = React.useCallback(() => {
    // React.useEffect(() => 
    // performUserSearch(store.getState()), [performUserSearch]);
  // }, []);
  // React.useMemo(() => thing(), [thing]);
  // useMemo(() => performUserSearch(), [performUserSearch]);
  const deleteButtonDisabled = !selectedUserRowId;

  return (
    <div className="UserSearch-main">
      <div className="header">
        <Button
          className="toolbar-button-small primary"
          onClick={() => history.push("/newUser")}
          icon="plus"
        >
          Create
        </Button>
        {deleteButtonDisabled ? (
          <div>
            <Button
              className="toolbar-button-small primary"
              disabled
              icon="edit"
            >
              View/edit
            </Button>
          </div>
        ) : (
            <Button
              className="toolbar-button-small primary"
              onClick={() => history.push(`/user/${selectedUserRowId}`)}
              icon="edit"
            >
              View/edit
          </Button>
          )}

        <div>
          <Button
            disabled={deleteButtonDisabled}
            onClick={() => {
              deleteSelectedUser();
              history.push('/userSearch');
            }}
            className="toolbar-button-small primary"
            icon="trash"
          >
            Delete
          </Button>
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
            className="-striped -highlight UserSearch-table"
            columns={getColumnFormat(selectedUserRowId)}
            defaultSorted={[
              {
                id: "email",
                desc: true
              }
            ]}
            filterable={isFilteringEnabled}
            showPagination
            loading={showSearchLoader}
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
            getTrProps={(state:any, rowInfo:RowInfo) => {
              let selected = false;
              if (rowInfo) {
                selected = rowInfo.row.id === selectedUserRowId;
              }
              return {
                onClick: (target:any, event:any) => {
                  selectRow(rowInfo.row.id);
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
