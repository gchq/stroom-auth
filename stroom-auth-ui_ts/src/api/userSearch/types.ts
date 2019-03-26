import { User } from "../users/types";

export interface StoreState {
  selectedUserRowId: string | undefined;
  users: User[];
  showSearchLoader: boolean;
  results: User[];
}
