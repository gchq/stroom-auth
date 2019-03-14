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
import PropTypes from "prop-types";

import TokenLayout from "./TokenLayout";
import {useApi as useUserSearchApi, 
  useActionCreators as useUserSearchActionCreators} from "../../../api/userSearch";
  import {useActionCreators as useTokenActionCreators} from '../../../api/tokens';


export const TokenCreate = () => {
  const {performUserSearch} = useUserSearchApi();    
  const {changeVisibleContainer} = useTokenActionCreators();
  changeVisibleContainer("create");
  performUserSearch();
  return <TokenLayout/>;
}

// export class TokenCreate extends Component {
//   componentWillMount() {
//     // We're going to store what we're displaying in the state. We could also detect what to display from the route.
//     this.context.store.dispatch(changeVisibleContainer("create"));
//     this.context.store.dispatch(performUserSearch());
//   }

//   render() {
//     return <TokenLayout />;
//   }
// }

export const TokenSearch = () => {
  const {changeVisibleContainer} = useTokenActionCreators();
  changeVisibleContainer("search");
  return <TokenLayout/>;
}

// export class TokenSearch extends Component {
//   componentWillMount() {
//     // We're going to store what we're displaying in the state. We could also detect what to display from the route.
//     this.context.store.dispatch(changeVisibleContainer("search"));
//   }

//   render() {
//     return <TokenLayout />;
//   }
// }

export const TokenEdit = () => {
  const {changeVisibleContainer} = useTokenActionCreators();
  changeVisibleContainer("edit");
  return <TokenLayout/>;
}

// export class TokenEdit extends Component {
//   componentWillMount() {
//     // We're going to store what we're displaying in the state. We could also detect what to display from the route.
//     this.context.store.dispatch(changeVisibleContainer("edit"));
//   }

//   render() {
//     return <TokenLayout />;
//   }
// }

// TokenCreate.contextTypes = {
//   store: PropTypes.object.isRequired
// };

// TokenSearch.contextTypes = {
//   store: PropTypes.object.isRequired
// };

// TokenEdit.contextTypes = {
//   store: PropTypes.object.isRequired
// };
