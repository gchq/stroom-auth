import { useCallback, useEffect } from "react";

import { useApi, useActionCreators } from '../tokenSearch';
import { useRouter } from "../../lib/useRouter";

/**
 * This hook connects the REST API calls to the Redux Store.
 */
const useTokenSearch = () => {
    const {
    } = useActionCreators();

    /**
     * Deletes the user and then refreshes our browser cache of users.
     */
    const { toggleState: toggleStateUsingApi } = useApi();
    const { toggleEnabled: toggleStateUsingRedux } = useActionCreators();
    const toggleState = useCallback(
        (tokenId: string) => {
            toggleStateUsingApi(tokenId)
                .then(() => toggleStateUsingRedux(tokenId));
        },
        [toggleStateUsingRedux]
    );

    return { toggleState };
};

export default useTokenSearch;
