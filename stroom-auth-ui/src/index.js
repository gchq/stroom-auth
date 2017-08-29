import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import {blue600, amber900} from 'material-ui/styles/colors'
import { MuiThemeProvider } from 'material-ui/styles'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import './index.css'
import App from './containers/app'
import store, { history } from './store'

const theme = getMuiTheme({
  palette: {
    primary1Color: blue600,
    accent1Color: amber900,
  }
})

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider muiTheme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  target
)