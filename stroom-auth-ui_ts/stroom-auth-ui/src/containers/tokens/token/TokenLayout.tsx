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
import { useState } from 'react';

import TokenSearch from '../tokenSearch';
import TokenCreate from '../tokenCreate';
import TokenEdit from '../tokenEdit';
// import { useApi as useTokenApi } from '../../../api/tokens'
import { useReduxState } from '../../../lib/useReduxState';

import '../../../styles/index.css';
import '../../../styles/toolbar-small.css';
import '../../../styles/toggle-small.css';

const TokenLayout = () => {
  const { show/*, selectedTokenRowId */} = useReduxState(({
    token: { show },
    tokenSearch: { selectedTokenRowId }
  }) => ({ show, selectedTokenRowId }));

  // const { deleteSelectedToken } = useTokenApi();
  // const [isHelpDialogOpen, setHelpDialogOpen] = useState(false);
  const [isFilteringEnabled,/* setFilteringEnabled*/] = useState(false);
  const showSearch = show === 'search';
  const showCreate = show === 'create';
  const showEdit = show === 'edit';

  return (
    <div className="Layout-main">
      <div className="User-content" id="User-content">
        {showSearch ? (
          <TokenSearch isFilteringEnabled={isFilteringEnabled} />
        ) : (
            undefined
          )}
        {showCreate ? <TokenCreate /> : undefined}
        {showEdit ? <TokenEdit /> : undefined}
      </div>
    </div>
  );
}

export default TokenLayout;
// class TokenLayout extends Component {
// constructor() {
//   super();
//   this.state = {
//     isHelpDialogOpen: false,
//   };
// }

// handleHelpDialogOpen() {
//   this.setState({isHelpDialogOpen: true});
// }

// handleHelpDialogClose() {
//   this.setState({isHelpDialogOpen: false});
// }

//   render() {
//     const {show} = this.props;
//     const showSearch = show === 'search';
//     const showCreate = show === 'create';
//     const showEdit = show === 'edit';
//     return (
//       <div className="Layout-main">
//         <div className="User-content" id="User-content">
//           {showSearch ? (
//             <TokenSearch isFilteringEnabled={this.state.isFilteringEnabled} />
//           ) : (
//             undefined
//           )}
//           {showCreate ? <TokenCreate /> : undefined}
//           {showEdit ? <TokenEdit /> : undefined}
//         </div>
//       </div>
//     );
//   }
// }

// TokenLayout.contextTypes = {
//   store: PropTypes.object.isRequired,
// };

// const mapStateToProps = state => ({
//   show: state.token.show,
//   selectedTokenRowId: state.tokenSearch.selectedTokenRowId,
// });

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       deleteSelectedToken,
//     },
//     dispatch,
//   );

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(TokenLayout);
