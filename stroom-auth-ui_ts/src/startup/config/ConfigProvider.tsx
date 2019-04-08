import * as React from "react";

import ConfigContext from "./ConfigContext";
import { Config } from "./types";
import Loader from "src/components/Loader";

const ConfigProvider: React.FunctionComponent = ({ children }) => {
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [config, setConfig] = React.useState<any>({});

  React.useEffect(() => {
    // Not using our http client stuff, it depends on things which won't be ready until the config is loaded
    fetch("/config.json",
    {headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    }, mode:"cors"})

      .then(r =>  {
        return r.json()
      })
      .then(c => {
        setConfig(c);
        setIsReady(true);
      })
      .catch(error => {
        console.error({error})
      });
  }, [setIsReady, fetch, setConfig]);

  if (!isReady) {
    return <Loader message="Waiting for config" />;
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export default ConfigProvider;
