import { useEffect } from "react";

import useApi from "./useApi";
import { useActionCreators } from "./redux";
import { User } from "../users/types";
import useReduxState from "../../lib/useReduxState";

/**
 * This hook connects the REST API calls to the Redux Store.
 */
interface UseUsers {
  users: Array<User>;
//   createIndexVolume: (nodeName: string, path: string) => void;
//   deleteIndexVolume: (id: string) => void;
//   addVolumeToGroup: (indexVolumeId: string, groupName: string) => void;
}

export default (): UseUsers => {
  const users = useReduxState(
    ({ userSearch: { users } }) => users
  );
  const {
    getUsers,
  } = useApi();

  const { updateResults } = useActionCreators();

  useEffect(() => {
    getUsers().then(updateResults);
  }, [updateResults]);

  return {
    users,
    // createIndexVolume: useCallback((nodeName: string, path: string) => {
    //   createIndexVolume(nodeName, path).then(indexVolumeCreated);
    // }, []),
    // deleteIndexVolume: useCallback(
    //   (id: string) => {
    //     deleteIndexVolume(id).then(() => indexVolumeDeleted(id));
    //   },
    //   [deleteIndexVolume]
    // ),
    // addVolumeToGroup: useCallback(
    //   (volumeId: string, groupName: string) => {
    //     addVolumeToGroup(volumeId, groupName).then(() =>
    //       indexVolumeAddedToGroup(volumeId, groupName)
    //     );
    //   },
    //   [addVolumeToGroup, indexVolumeAddedToGroup]
    // )
  };
};
