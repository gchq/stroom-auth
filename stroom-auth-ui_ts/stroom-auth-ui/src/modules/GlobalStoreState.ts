import {AuthenticationStoreState} from '../startup/authentication';
import {StoreState as ConfigStoreState } from "../startup/config";
import {StoreState as ErrorPageState} from "../components/ErrorPage";
import {StoreState as UserStoreState} from "../api/users"
import {StoreState as UserSearchState} from "../api/userSearch"

 export interface GlobalStoreState {
    config: ConfigStoreState;
    authentication: AuthenticationStoreState;
    errorPage: ErrorPageState;
    user: UserStoreState;
    userSearch: UserSearchState;
  }
  