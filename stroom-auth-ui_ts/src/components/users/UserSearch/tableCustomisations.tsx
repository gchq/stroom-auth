import * as React from "react";
import { ReactTableFunction, RowInfo } from "react-table";
import * as dateFormat from "dateformat";

/** There is a corresponding react-table type but doing it like this is neater. */
export type FilterProps = {
  filter: any;
  onChange: ReactTableFunction;
};

export const getColumnFormat = (selectedUserRowId: string | undefined) => {
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
      filterMethod: (filter: any, row: any) => filterRow(row, filter)
    },
    {
      Header: "Account status",
      accessor: "state",
      maxWidth: 100,
      Cell: (row: RowInfo) => renderStateCell(row.row.state),
      Filter: ({ filter, onChange }: FilterProps) =>
        getStateCellFilter(filter, onChange)
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
      filterMethod: (filter: any, row: any) => filterRow(row, filter)
    }
  ];
};

export const filterRow = (row: any, filter: any) => {
  var index = row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase());
  return index >= 0;
};

export const renderStateCell = (state: string) => {
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

export const getStateCellFilter = (filter: any, onChange: Function) => {
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

export const formatDate = (dateString: string) => {
  const dateFormatString = "ddd mmm d yyyy, hh:MM:ss";
  return dateString ? dateFormat(dateString, dateFormatString) : "";
};
