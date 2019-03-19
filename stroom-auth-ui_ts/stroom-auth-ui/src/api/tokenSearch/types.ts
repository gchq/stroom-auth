import { Token } from "../tokens";

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
