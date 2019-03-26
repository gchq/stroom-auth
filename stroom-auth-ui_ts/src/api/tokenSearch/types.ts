import { Token } from "../tokens";
import { Filter } from 'react-table';

export interface StoreState {
  tokens: Token[];
  showSearchLoader: boolean;
  selectedTokenRowId: string | undefined;
  results: Token[];
  totalPages?: number;
  errorStatus?: string;
  errorText?: string;
  lastUsedPageSize?: number;
  lastUsedSorted?: any;
  lastUsedPage?: any;
  lastUsedFiltered?: any;
}

export interface TokenSearchRequest {
  pageSize?: number,
  page?: number,
  sorted?: string,
  filtered?: Filter[]
}

export interface TokenSearchResponse {
  tokens: Token[],
  totalPages: number
}