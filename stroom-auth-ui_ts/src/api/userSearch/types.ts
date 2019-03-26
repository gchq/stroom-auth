import { User } from "../users/types";

export interface StoreState {
  results: User[];
  selectedUserRowId: string | undefined;
  showSearchLoader: boolean;
  users: User[];
}
