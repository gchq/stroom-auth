import * as React from "react";

import ConfigContext from "./ConfigContext";

export const useConfig = () => React.useContext(ConfigContext);

export default useConfig;
