export interface StoreState {
  user: string;
  password: string;
  showCreateLoader: boolean;
  alertText: string;
  showAlert: boolean;
  changePasswordErrorMessage: any; // TODO: should be an array type of String
  isSaving: boolean;
  userBeingEdited?: User;
  errorStatus?: string;
  errorText?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  state: string;
  comments: string;
  never_expires: boolean;
  force_password_change: boolean;
}
export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
  redirectUrl: string;
}

export interface ResetPasswordRequest {
  password: string;
}
