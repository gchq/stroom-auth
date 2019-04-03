import { StoreState as AuthenticationStoreState } from "../api/authentication";
import { StoreState as ErrorPageState } from "../components/ErrorPage";
import { StoreState as UserStoreState } from "../components/users";

export interface GlobalStoreState {
  authentication: AuthenticationStoreState;
  errorPage: ErrorPageState;
  user: UserStoreState;
}
