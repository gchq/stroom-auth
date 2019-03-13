/*
 * Copyright 2017 Crown Copyright
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
import { useContext, useCallback } from "react";
import { StoreContext } from "redux-react-hook";
import { useActionCreators } from "./redux";
import useHttpClient from "../useHttpClient"
import { HttpError } from "../../ErrorTypes";
import { handleErrors, getJsonBody } from "../../modules/fetchFunctions";

interface Api {
    performUserSearch: () => void;
}

export const useApi = (): Api => {
    const store = useContext(StoreContext);
    const { showSearchLoader, updateResults } = useActionCreators();

    const performUserSearch = useCallback(() => {
        showSearchLoader(true);
        const url = `${store.config.userServiceUrl}/?fromEmail=&usersPerPage=100&orderBy=id`;
        const { httpGetJson } = useHttpClient();
        httpGetJson(url)
            .then(handleStatus)
            .then(getJsonBody)
            .then(data => {
                showSearchLoader(false);
                updateResults(data);
            })
            .catch(error => handleErrors(error)); //FIXME: this still needs fixing
    }, [showSearchLoader, updateResults]);
}

export default useApi;

function handleStatus(response) {
    if (response.status === 200) {
        return Promise.resolve(response);
    } else if (response.status === 409) {
        return Promise.reject(
            new HttpError(
                response.status,
                "This user already exists - please use a different email address."
            )
        );
    } else {
        return Promise.reject(new HttpError(response.status, response.statusText));
    }
}
