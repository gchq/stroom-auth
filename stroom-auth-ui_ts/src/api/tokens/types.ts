export interface StoreState {
  lastReadToken: any;
  isCreating: any;
  errorMessage: String;
  matchingAutoCompleteResults: String[];
  show: string;
}

export interface Token {
  id: String;
  enabled: any;
}
