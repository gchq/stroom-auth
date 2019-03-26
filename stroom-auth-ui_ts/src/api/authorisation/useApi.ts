/*
 * Copyright 2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { StoreContext } from "redux-react-hook";
import { useContext, useCallback } from "react";

import { GlobalStoreState } from "../../modules/GlobalStoreState";
import useHttpClient from '../useHttpClient';

interface Api {
    createUser: (userEmail: string) => Promise<void>;
}
export const useApi = (): Api => {
    const store = useContext(StoreContext);
    const {httpPostEmptyResponse} = useHttpClient();

    const createUser = useCallback(
        (userEmail:string) => {
            const reduxState: GlobalStoreState = store.getState();
            const url = `${reduxState.config.values.authorisationServiceUrl}/createUser?id=${userEmail}`;
            return httpPostEmptyResponse(url, {})
        }, []
    );

    return {
        createUser,
    } as Api;
};

export default useApi;
