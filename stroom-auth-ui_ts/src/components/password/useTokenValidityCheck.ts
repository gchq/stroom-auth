import useHttpQueryParam from "src/lib/useHttpQueryParam";
import { useEffect, useState } from 'react';
import * as jwtDecode from 'jwt-decode';

export const useTokenValidityCheck = () => {

  const [isTokenMissing, setMissingToken] = useState(false);
  const [isTokenInvalid, setInvalidToken] = useState(false);
  const [isTokenExpired, setExpiredToken] = useState(false);

  const token = useHttpQueryParam("token");

  useEffect(() => {
    let missingToken = false;
    let invalidToken = false;
    let expiredToken = false;

    // Validate token
    if (!token) {
      missingToken = true;
    } else {
      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const now = new Date().getTime() / 1000;
        expiredToken = decodedToken.exp <= now;
      } catch (err) {
        invalidToken = true;
      }
    }

    setMissingToken(missingToken);
    setInvalidToken(invalidToken);
    setExpiredToken(expiredToken);

    // if (!missingToken && !invalidToken && !expiredToken && token) {
    // If we have a valid token we're going to save it, so we can easily
    // use it with getState when requesting the change.
    // changeToken(token);
    // }
  });
  return { isTokenMissing, isTokenInvalid, isTokenExpired };
}