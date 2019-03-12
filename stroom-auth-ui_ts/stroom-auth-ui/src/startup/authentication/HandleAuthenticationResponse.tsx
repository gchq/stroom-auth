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
import * as queryString from "qs";
import { useEffect, useMemo } from "react";

import {
  handleAuthenticationResponse,
  useActionCreators
} from "./authentication";
import useRouter from "../../lib/useRouter";

interface Props {
  authenticationServiceUrl: string;
  authorisationServiceUrl: string;
}

export const HandleAuthenticationResponse: React.FunctionComponent<Props> = ({
  authenticationServiceUrl,
  authorisationServiceUrl
}: Props) => {
  const {
    router: { location },
    history
  } = useRouter();
  const { tokenIdChange } = useActionCreators();

  const accessCode = useMemo(() => {
    let query = location!.search;
    if (query[0] == "?") {
      query = query.substring(1);
    }
    return queryString.parse(query).accessCode;
  }, [location]);

  useEffect(() => {
    handleAuthenticationResponse(
      tokenIdChange,
      history,
      accessCode,
      authenticationServiceUrl,
      authorisationServiceUrl
    );
  }, [
    accessCode,
    tokenIdChange,
    history,
    authenticationServiceUrl,
    authorisationServiceUrl
  ]);

  return null;
};

export default HandleAuthenticationResponse;
