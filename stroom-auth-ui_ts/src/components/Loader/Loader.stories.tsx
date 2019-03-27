import * as React from "react";
import { storiesOf } from "@storybook/react";

import Loader from "./Loader";

storiesOf("General Purpose/Loader", module)
    .add("Basic", () => <Loader message="Stuff is loading" />);
