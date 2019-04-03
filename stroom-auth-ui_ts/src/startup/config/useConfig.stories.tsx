import * as React from "react";

import { storiesOf } from "@storybook/react";
import useConfig from "./useConfig";
import JsonDebug from "src/testing/JsonDebug";

const TestHarness: React.FunctionComponent = () => {
  const config = useConfig();

  return <JsonDebug value={config} />;
};

storiesOf("Custom Hooks/useConfig", module).add("test", () => <TestHarness />);
