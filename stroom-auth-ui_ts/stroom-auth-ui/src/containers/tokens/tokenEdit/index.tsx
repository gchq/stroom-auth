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

import * as React from 'react';
import { Component } from "react";
import * as PropTypes from "prop-types";

import TokenEditUi from "./TokenEditUi";
import { useApi as useTokenApi } from '../../../api/tokens';
import { useRouter } from '../../../lib/useRouter';
// import { fetchApiKey } from "../../../modules/token";

import * as queryString from "qs";
const TokenEditForm = () => {
  const { fetchApiKey } = useTokenApi();
  const { router } = useRouter();
  React.useEffect(() => {
    if (router.path !== undefined) {
      const queryParams = queryString.parse(router.path);
      const tokenId = queryParams['tokenId'];
      fetchApiKey(tokenId);
    }
  }, []);

  return <TokenEditUi />;
}


// class TokenEditForm extends Component {
//   constructor() {
//     super();
//     this.state = {};
//   }

//   async componentDidMount() {
//     const tokenId = this.context.router.route.match.params.tokenId;
//     this.context.store.dispatch(fetchApiKey(tokenId));

//     // TODO get user from API and put into store
//     // TODO Load from store? How?
//   }

//   render() {
//     return <TokenEditUi />;
//   }
// }

// TokenEditForm.contextTypes = {
//   store: PropTypes.object.isRequired,
//   router: PropTypes.shape({
//     history: object.isRequired
//   })
// };

export default TokenEditForm;
