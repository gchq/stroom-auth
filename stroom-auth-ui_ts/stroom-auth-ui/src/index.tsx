import * as React from "react";
import * as ReactDOM from "react-dom";
// import { compose } from "redux";
import { StoreContext } from "redux-react-hook";

import App from './containers/app';
import registerServiceWorker from './registerServiceWorker';



import "./styles/index.css";
// import Routes from "./startup/Routes";
import createStore from "./startup/store";
import './index.css';
import './startup/icons'
// import store from './store';
import useFontAwesome from "./lib/useFontAwesome";
import { CustomRouter } from "./lib/useRouter";


const store = createStore();

const AppWrapper: React.FunctionComponent = () => {
  useFontAwesome();
  return (
    <StoreContext.Provider value={store}>
        <CustomRouter>
          <App />
        </CustomRouter>
    </StoreContext.Provider>
  );
};

ReactDOM.render(<AppWrapper />, document.getElementById("root") as HTMLElement);
registerServiceWorker();