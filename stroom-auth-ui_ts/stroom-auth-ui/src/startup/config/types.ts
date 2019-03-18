//FIXME: this needs to match congfig.template.json
export interface Config {
  tokenServiceUrl: any;
  authenticationServiceUrl?: string;
  authorisationServiceUrl?: string;
  stroomBaseServiceUrl?: string;
  advertisedUrl?: string;
  authUsersUiUrl?: string;
  authTokensUiUrl?: string;
  allowPasswordResets?: string;
  appClientId?: string;
  stroomUiUrl: string;
  userServiceUrl: string;
}

export interface StoreState {
  isReady: boolean;
  values: Config;
}
