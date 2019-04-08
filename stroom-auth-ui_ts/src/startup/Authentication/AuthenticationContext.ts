import * as React from "react";

interface AuthenticationContextApi {
  idToken?: string;
  setIdToken: (idToken: string) => void;
}

const AuthenticationContext: React.Context<
  AuthenticationContextApi
> = React.createContext({
  idToken: undefined,
  setIdToken: () => {
    console.error("Default Implementation for Authentication Context");
  },
});

export default AuthenticationContext;
