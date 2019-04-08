import { StoreState as AuthenticationStoreState } from "../api/authentication";
import { StoreState as UserStoreState } from "../components/users";

export interface GlobalStoreState {
  authentication: AuthenticationStoreState;
  user: UserStoreState;
}
