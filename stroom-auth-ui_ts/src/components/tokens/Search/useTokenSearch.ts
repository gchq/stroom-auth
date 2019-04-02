import { useCallback } from "react";

import { useActionCreators } from 'src/api/tokenSearch';
import { useApi } from 'src/api/tokens';

/**
 * This hook connects the REST API calls to the Redux Store.
 */
const useTokenSearch = () => {

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
