import { useMemo } from "react";
import { Dispatch, Action } from "redux";
import { useDispatch } from "redux-react-hook";

/**
 * Higher Order Function to dispatch actions from action creators.
 * Given a redux Action creator, wraps it in a call to dispatch.
 *
 * @param dispatch The Redux dispatch function
 * @param func The action creator
 */
export const wrapDispatch = function<T extends (...args: any[]) => Action>(
  dispatch: Dispatch,
  actionCreator: T
): (...funcArgs: Parameters<T>) => void {
  return (...args: Parameters<T>) => dispatch(actionCreator(...args));
};

/**
 * Given a map of Action Creators, generates a map of functions
 * that handle the dispatch.
 *
 * @param actionCreators The map of action creators
 */
export const genUseActionCreators = function<
  T extends { [k: string]: (...args: any[]) => Action }
>(actionCreators: T): () => T {
  return () => {
    const dispatch = useDispatch();

    // Memoizing this is crucial!
    // A lot of follow on memoization will depend on the action creators not changing (to be strict)
    return useMemo(
      () =>
        Object.keys(actionCreators).reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: wrapDispatch(dispatch, actionCreators[curr])
          }),
          {}
        ) as T,
      [dispatch, actionCreators]
    );
  };
};

export default genUseActionCreators;
