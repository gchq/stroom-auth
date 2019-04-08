import * as React from "react";
import * as ReactDOM from "react-dom";

import "./styles/index.css";
import "./index.css";
import "./startup/icons";
import App from "./components/app";
import registerServiceWorker from "./registerServiceWorker";
import useFontAwesome from "./lib/useFontAwesome";
import { CustomRouter } from "./lib/useRouter";
import { ConfigProvider } from "./startup/config";
import { AuthenticationContextProvider } from './startup/authentication';

const AppWrapper: React.FunctionComponent = () => {
  useFontAwesome();
  return (
    <ConfigProvider>
      <AuthenticationContextProvider>
        <CustomRouter>
          <App />
        </CustomRouter>
      </AuthenticationContextProvider>
    </ConfigProvider>
  );
};

ReactDOM.render(<AppWrapper />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
