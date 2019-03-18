export interface Config {
  authenticationServiceUrl?: string;
  authorisationServiceUrl?: string;
  stroomBaseServiceUrl?: string;
  advertisedUrl?: string;
  authUsersUiUrl?: string;
  authTokensUiUrl?: string;
  allowPasswordResets?: string;
  appClientId?: string;
  stroomUiUrl?: String;
}

export interface StoreState {
  isReady: boolean;
  values: Config;
}
