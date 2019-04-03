import * as React from "react";
import * as ReactDOM from "react-dom";
import { StoreContext } from "redux-react-hook";

import "./styles/index.css";
import "./index.css";
import "./startup/icons";
import App from "./components/app";
import createStore from "./startup/store";
import registerServiceWorker from "./registerServiceWorker";
import useFontAwesome from "./lib/useFontAwesome";
import { CustomRouter } from "./lib/useRouter";
import { ConfigProvider } from './startup/config';

const store = createStore();

const AppWrapper: React.FunctionComponent = () => {
  useFontAwesome();
  return (
    <ConfigProvider>
      <StoreContext.Provider value={store}>
        <CustomRouter>
          <App />
        </CustomRouter>
      </StoreContext.Provider>
    </ConfigProvider>
  );
};

ReactDOM.render(<AppWrapper />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
