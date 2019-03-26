export interface StoreState {
  lastReadToken: any;
  isCreating: any;
  errorMessage: string;
  matchingAutoCompleteResults: string[];
  show: string;
}

export interface Token {
  id: string;
  enabled: any;
}
