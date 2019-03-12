export interface StoreState {
    user: String;
    password: String; 
    showCreateLoader: boolean; 
    alertText: String; 
    showAlert: boolean; 
    changePasswordErrorMessage: any; // TODO: should be an array type of String
    isSaving: boolean;
    userBeingEdited: User;
  }

export interface User {
  email: string;  first_name: string;
  last_name: string;
  state: string;
  comments: string;
  never_expires: boolean;
  force_password_change: boolean;
}
  export interface ChangePasswordRequest {
    email: String;
    oldPassword: String;
    newPassword: String;
    redirectUrl: String;
  }

  export interface ResetPasswordRequest {
    password: String;
  }