export interface StoreState {
    token: String;
    showLoader: boolean;
    loggedInUserEmail: String | undefined;
  }

export interface Credentials {
    email: String;
    password: String;
}
