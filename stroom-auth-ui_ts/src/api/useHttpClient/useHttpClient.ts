import * as React from "react";

import { useErrorReporting } from "src/components/ErrorPage";

import handleStatus from "./handleStatus";
import { useAuthenticationContext } from 'src/startup/authentication';

/**
 * A wrapper around HTTP fetch that allows us to plop in idTokens, CORS specifications,
 * and general common stuff like that.
 */

type HttpCall = (
  url: string,
  options?: {
    [s: string]: any;
  },
  authenticate?: boolean,
) => Promise<any>;

interface HttpClient {
  httpGetJson: (
    url: string,
    options?: {
      [s: string]: any;
    },
    forceGet?: boolean,
  ) => Promise<any>;
  httpGetEmptyResponse: HttpCall;
  httpPostJsonResponse: HttpCall;
  httpPutJsonResponse: HttpCall;
  httpDeleteJsonResponse: HttpCall;
  httpPatchJsonResponse: HttpCall;
  httpPostEmptyResponse: HttpCall;
  httpPutEmptyResponse: HttpCall;
  httpDeleteEmptyResponse: HttpCall;
  httpPatchEmptyResponse: HttpCall;
  clearCache: () => void;
}

// Cache GET Promises by URL -- Effectively static/global to the application
let cache = {};

export const useHttpClient = (): HttpClient => {
  const { idToken } = useAuthenticationContext();
  const { reportError } = useErrorReporting();

  const catchImpl = React.useCallback(
    (error: any) => {
      reportError({
        errorMessage: error.message,
        stackTrace: error.stack,
        httpErrorCode: error.status,
      });
    },
    [reportError],
  );

  const httpGetJson = React.useCallback(
    <T>(
      url: string,
      options: {
        [s: string]: any;
      } = {},
      authenticate: boolean = true,
      forceGet: boolean = true, // default to true, take care with settings this to false, old promises can override the updated picture with old information if this is mis-used
    ): Promise<T | void> => {
      // console.group("HTTP GET");
      // console.log("Fetching", { url, cacheKeys: Object.keys(cache) });

      if (!idToken && authenticate) {
        let p = Promise.reject();
        p.catch(() => console.log("Missing ID Token, not making request"));
        return p;
      }

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options ? options.headers : {}),
      };

      if (authenticate) {
        headers.Authorization = `Bearer ${idToken}`;
      }

      // If we do not have an entry in the cache or we are forcing GET, create a new call
      if (!cache[url] || forceGet) {
        // console.log("Making a Fresh Call");
        cache[url] = fetch(url, {
          method: "get",
          mode: "cors",
          ...options,
          headers: headers
        })
          .then(handleStatus)
          .then(r => r.json())
          .catch(catchImpl);
      }
      // console.groupEnd();

      return cache[url];
    },
    [catchImpl, idToken],
  );

  const useFetchWithBodyAndJsonResponse = (method: string) =>
    React.useCallback(
      <T>(
        url: string,
        options?: {
          [s: string]: any;
        },
        authenticate: boolean = true,
      ): Promise<T | void> => {
        if (!idToken && authenticate) {
          let p = Promise.reject();
          p.catch(() => console.log("Missing ID Token, not making request"));
          return p;
        }

        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(options ? options.headers : {}),
        };

        if (authenticate) {
          headers.Authorization = `Bearer ${idToken}`;
        }

        return fetch(url, {
          mode: "cors",
          ...options,
          method,
          headers,
        })
          .then(handleStatus)
          .then(r => r.json())
          .catch(catchImpl);
      },
      [catchImpl, idToken],
    );

  const useFetchWithBodyAndEmptyResponse = (method: string) =>
    React.useCallback(
      (
        url: string,
        options?: {
          [s: string]: any;
        },
        authenticate: boolean = true,
      ): Promise<string | void> => {
        if (!idToken && authenticate) {
          let p = Promise.reject();
          p.catch(() => console.log("Missing ID Token, not making request"));
          return p;
        }

        const headers = {
          "Content-Type": "application/json",
          ...(options ? options.headers : {}),
        };

        if (authenticate) {
          headers.Authorization = `Bearer ${idToken}`;
        }

        return fetch(url, {
          mode: "cors",
          ...options,
          method,
          headers,
        })
          .then(handleStatus)
          .then(r => r.text())
          .catch(catchImpl);
      },
      [catchImpl, idToken],
    );

  return {
    httpGetJson,
    httpGetEmptyResponse: useFetchWithBodyAndEmptyResponse("get"),
    httpPostJsonResponse: useFetchWithBodyAndJsonResponse("post"),
    httpPutJsonResponse: useFetchWithBodyAndJsonResponse("put"),
    httpDeleteJsonResponse: useFetchWithBodyAndJsonResponse("delete"),
    httpPatchJsonResponse: useFetchWithBodyAndJsonResponse("patch"),
    httpPostEmptyResponse: useFetchWithBodyAndEmptyResponse("post"),
    httpPutEmptyResponse: useFetchWithBodyAndEmptyResponse("put"),
    httpDeleteEmptyResponse: useFetchWithBodyAndEmptyResponse("delete"),
    httpPatchEmptyResponse: useFetchWithBodyAndEmptyResponse("patch"),
    clearCache: () => {
      cache = {};
    },
  };
};

export default useHttpClient;
