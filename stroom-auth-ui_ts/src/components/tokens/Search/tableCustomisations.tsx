import * as React from "react";
import "react-toggle/style.css";
import "rc-checkbox/assets/index.css";
import {
  RowRenderProps,
  ReactTableFunction,
  RowInfo,
  Column
} from "react-table";
import "react-table/react-table.css";
import * as dateFormat from "dateformat";

import "src/styles/index.css";
import "src/styles/table-small.css";
import "src/styles/toggle-small.css";
import "src/styles/toolbar-small.css";

import "./TokenSearch.css";

/** There is a corresponding react-table type but doing it like this is neater. */
type FilterProps = {
  filter: any;
  onChange: ReactTableFunction;
};

export const getColumnFormat = (
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
      filterable: false,
      maxWidth: 165
    },
    {
      Header: "Issued on",
      accessor: "issued_on",
      Cell: (row: RowInfo) => formatDate(row.row.value),
      filterable: false,
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
    <div className="TokenSearch__table__checkbox">
      <input
        type="checkbox"
        checked={state}
        onChange={() => setEnabledStateOnToken(tokenId, !state)}
      />
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