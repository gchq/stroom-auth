import { User } from '../users/types';

export interface StoreState {
    selectedUserRowId: String | undefined;
   users: User[]; 
showSearchLoader: boolean;
    results: User[];
}