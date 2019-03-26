export interface Config {
  advertisedUrl?: string;
  allowPasswordResets?: string;
  appClientId?: string;
  authenticationServiceUrl?: string;
  authorisationServiceUrl?: string;
  stroomUiUrl: string;
  tokenServiceUrl: any;
  userServiceUrl: string;
}

export interface StoreState {
  tokenServiceUrl: any;
  isReady: boolean;
  values: Config;
}
