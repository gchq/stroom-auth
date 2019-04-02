import { User } from "../users/types";

export interface StoreState {
  selectedUserRowId: string | undefined;
  showSearchLoader: boolean;
  users: User[];
}
