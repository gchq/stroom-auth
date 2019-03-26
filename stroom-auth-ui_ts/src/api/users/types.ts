export interface StoreState {
  alertText: string;
  changePasswordErrorMessage: any;
  errorStatus?: string;
  errorText?: string;
  isSaving: boolean;
  password: string;
  showAlert: boolean;
  showCreateLoader: boolean;
  user: string;
  userBeingEdited?: User;
}

export interface User {
  comments: string;
  created_by_user?: any;
  created_on?: any;
  email: string;
  first_name: string;
  force_password_change: boolean;
  id?: string;
  last_login?: any;
  last_name: string;
  login_count?: number;
  never_expires?: boolean;
  state: string;
  updated_by_user?: any;
  updated_on?: any;
}
