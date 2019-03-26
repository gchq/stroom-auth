import { Filter, SortingRule } from 'react-table';
import { Token } from "../tokens";

export interface StoreState {
  errorStatus?: string;
  errorText?: string;
  lastUsedFiltered?: any;
  lastUsedPage?: any;
  lastUsedPageSize?: number;
  lastUsedSorted?: any;
  results: Token[];
  selectedTokenRowId: string | undefined;
  showSearchLoader: boolean;
  tokens: Token[];
  totalPages?: number;
}

export interface TokenSearchRequest {
  filtered?: Filter[]
  page?: number,
  pageSize?: number,
  sorted?: SortingRule[],
}

export interface TokenSearchResponse {
  tokens: Token[],
  totalPages: number
}