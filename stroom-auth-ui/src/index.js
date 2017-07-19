import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

// import createPalette from 'material-ui/styles/palette'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
// import blue from 'material-ui/colors/blue'
// import amber from 'material-ui/colors/amber'
// import red from 'material-ui/colors/red'

import registerServiceWorker from './registerServiceWorker'
import App from './containers/app'
import store, { history } from './store'
import './index.css'

// const theme = createMuiTheme({
//   // palette: createPalette({
//   //   primary: blue,
//   //   accent: amber,
//   //   error: red
//   // }),
//     palette:{
//     primary: blue,
//     accent: amber,
//     error: red
//   },
// })

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

registerServiceWorker()

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider /*theme={theme}*/>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  target
)