import * as React from 'react';
import { storiesOf } from "@storybook/react";
import { SearchToken } from '..';

const stories = storiesOf("Tokens/Create", module);

stories.add("basic", () => (
  <SearchToken />
))