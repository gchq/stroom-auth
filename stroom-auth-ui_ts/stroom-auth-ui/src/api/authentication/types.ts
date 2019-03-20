export interface StoreState {
  token: String;
  showLoader: boolean;
  loggedInUserEmail: String | undefined;
}

export interface Credentials {
  email: String;
  password: String;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  password: string;
  redirectUrl: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface LoginResponse {
  loginSuccessful: boolean;
  redirectUrl: string;
  message: string;
}
