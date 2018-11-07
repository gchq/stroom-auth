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

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {StoreProvider} from 'redux-react-hook';
import {ConnectedRouter} from 'react-router-redux';
import {blue600, amber900} from 'material-ui/styles/colors';
import {MuiThemeProvider} from 'material-ui/styles';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faTimes,
  faSave,
  faPlus,
  faTrash,
  faEdit,
  faCopy,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

import './styles/index.css';
import App from './containers/app';
import store, {history} from './store';

library.add(faSave, faTimes, faPlus, faTrash, faEdit, faCopy, faArrowLeft);

const theme = getMuiTheme({
  palette: {
    primary1Color: blue600,
    accent1Color: amber900,
  },
});

// TODO: The StoreProvider is required by redux-react-hooks.
// When Redux publish their own hooks this will be obsolete.
render(
  <StoreProvider value={store}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MuiThemeProvider muiTheme={theme}>
          <App />
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  </StoreProvider>,
  document.querySelector('#root'),
);
