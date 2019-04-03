import { Filter, SortingRule } from 'react-table';

export interface StoreState {
  lastReadToken: any;
  isCreating: any;
  errorMessage: string;
  matchingAutoCompleteResults: string[];
  show: string;
}

export interface Token {
  id: string;
  enabled: boolean;
  user_email: string;
  expires_on: string;
  issued_on: string;
  issued_by_user: string;
  updated_on: string;
  updated_by_user: string;
  token: string;
}
export type SearchConfig = {
  filters: Filter[],
  page: number,
  pageSize: number,
  sorting: SortingRule[]
};

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