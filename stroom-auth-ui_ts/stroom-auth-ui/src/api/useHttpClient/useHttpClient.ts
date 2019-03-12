import { useCallback } from "react";

import { useActionCreators as useErrorActionCreators } from "../../components/ErrorPage";

import handleStatus from "./handleStatus";
import { useContext } from "react";
import { StoreContext } from "redux-react-hook";
import useRouter from "../../lib/useRouter";

/**
 * A wrapper around fetch that can be used to de-duplicate GET calls to the same resources.
 * It also allows us to track all the URL's which are being requested from remote servers so that we can
 * add a status bar to the UI to indicate how the requests are going.
 *
 * @param {function} dispatch The redux dispatch funciton
 * @param {object} state The current redux state
 * @param {string} url The URL to fetch
 * @param {function} successCallback The function to call with the response if successful. Failures will be handled generically
 */

type HttpCall = (
  url: string,
  options?: {
    [s: string]: any;
  }
) => Promise<any>;

interface HttpClient {
  httpGetJson: (
    url: string,
    options?: {
      [s: string]: any;
    },
    forceGet?: boolean
  ) => Promise<any>;
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
  const store = useContext(StoreContext);
  const {
    setErrorMessage,
    setHttpErrorCode,
    setStackTrace
  } = useErrorActionCreators();
  const { history } = useRouter();

  if (!store) {
    throw new Error("Could not get Redux Store for making HTTP calls");
  }

  const httpGetJson = useCallback(
    <T>(
      url: string,
      options: {
        [s: string]: any;
      } = {},
      forceGet: boolean = true // default to true, take care with settings this to false, old promises can override the updated picture with old information if this is mis-used
    ): Promise<T | void> => {
      const state = store.getState();
      const jwsToken = state.authentication.idToken;

      // If we do not have an entry in the cache or we are forcing GET, create a new call
      if (!cache[url] || forceGet) {
        cache[url] = fetch(url, {
          method: "get",
          mode: "cors",
          ...options,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwsToken}`,
            ...(options ? options.headers : {})
          }
        })
          .then(handleStatus)
          .then(r => r.json())
          .catch(error => {
            setErrorMessage(error.message);
            setStackTrace(error.stack);
            setHttpErrorCode(error.status);
            history.push("/s/error");
          });
      }

      return cache[url];

      // console.groupEnd();
    },
    [setErrorMessage, setHttpErrorCode, setStackTrace]
  );

  const wrappedFetchWithBodyAndJsonResponse = (method: string) =>
    useCallback(
      <T>(
        url: string,
        options?: {
          [s: string]: any;
        }
      ): Promise<T | void> => {
        const state = store.getState();
        const jwsToken = state.authentication.idToken;

        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwsToken}`,
          ...(options ? options.headers : {})
        };

        return fetch(url, {
          mode: "cors",
          ...options,
          method,
          headers
        })
          .then(handleStatus)
          .then(r => r.json())
          .catch(error => {
            setErrorMessage(error.message);
            setStackTrace(error.stack);
            setHttpErrorCode(error.status);
            history.push("/s/error");
          });
      },
      [setErrorMessage, setStackTrace, setHttpErrorCode]
    );

  const wrappedFetchWithBodyAndEmptyResponse = (method: string) =>
    useCallback(
      (
        url: string,
        options?: {
          [s: string]: any;
        }
      ): Promise<string | void> => {
        const state = store.getState();
        const jwsToken = state.authentication.idToken;

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwsToken}`,
          ...(options ? options.headers : {})
        };

        return fetch(url, {
          mode: "cors",
          ...options,
          method,
          headers
        })
          .then(handleStatus)
          .then(r => r.text())
          .catch(error => {
            setErrorMessage(error.message);
            setStackTrace(error.stack);
            setHttpErrorCode(error.status);
            history.push("/s/error");
          });
      },
      [setErrorMessage, setStackTrace, setHttpErrorCode]
    );

  return {
    httpGetJson,
    httpPostJsonResponse: wrappedFetchWithBodyAndJsonResponse("post"),
    httpPutJsonResponse: wrappedFetchWithBodyAndJsonResponse("put"),
    httpDeleteJsonResponse: wrappedFetchWithBodyAndJsonResponse("delete"),
    httpPatchJsonResponse: wrappedFetchWithBodyAndJsonResponse("patch"),
    httpPostEmptyResponse: wrappedFetchWithBodyAndEmptyResponse("post"),
    httpPutEmptyResponse: wrappedFetchWithBodyAndEmptyResponse("put"),
    httpDeleteEmptyResponse: wrappedFetchWithBodyAndEmptyResponse("delete"),
    httpPatchEmptyResponse: wrappedFetchWithBodyAndEmptyResponse("patch"),
    clearCache: () => {
      cache = {};
    }
  };
};

export default useHttpClient;
