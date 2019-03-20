import { StoreState as AuthenticationStoreState } from "../api/authentication";
import { StoreState as ConfigStoreState } from "../startup/config";
import { StoreState as ErrorPageState } from "../components/ErrorPage";
import { StoreState as UserStoreState } from "../api/users";
import { StoreState as UserSearchState } from "../api/userSearch";
import { StoreState as TokenStoreState } from "../api/tokens";
import { StoreState as TokenSearchStoreState } from "../api/tokenSearch";

export interface GlobalStoreState {
  config: ConfigStoreState;
  authentication: AuthenticationStoreState;
  errorPage: ErrorPageState;
  user: UserStoreState;
  userSearch: UserSearchState;
  token: TokenStoreState;
  tokenSearch: TokenSearchStoreState;
}
