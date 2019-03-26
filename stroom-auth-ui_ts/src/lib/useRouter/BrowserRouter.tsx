import * as React from "react";
import { Router, Route, RouteProps } from "react-router-dom";

import createHistory from "history/createBrowserHistory";
import { History } from "history";

export const history = createHistory();

export const RouterContext = React.createContext<RouteProps>({});
export const HistoryContext = React.createContext<History>(history);

const CustomRouter: React.FunctionComponent = ({ children }) => (
  <Router history={history}>
    <Route>
      {routeProps => (
        <HistoryContext.Provider value={history}>
          <RouterContext.Provider value={routeProps}>
            {children}
          </RouterContext.Provider>
        </HistoryContext.Provider>
      )}
    </Route>
  </Router>
);

export default CustomRouter;
