/*
 * Copyright 2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from "react";
import * as storybook from "@storybook/react";
import { addParameters, configure, addDecorator } from "@storybook/react";
import StoryRouter from "storybook-react-router";

const req = require.context("../src", true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// Option defaults:
addParameters({
  /**
   * name to display in the top left corner
   * @type {String}
   */
  brandTitle: "Stroom storybook",
  /**
   * URL for name in top left corner to link to
   * @type {String}
   */
  brandUrl: "#",
  /**
   * show story component as full screen
   * @type {Boolean}
   */
  isFullScreen: false,
  /**
   * display panel that shows a list of stories
   * @type {Boolean}
   */
  showNav: true,
  /**
   * display panel that shows addon configurations
   * @type {Boolean}
   */
  showPanel: false,
  /**
   * regex for finding the hierarchy separator
   * @example:
   *   null - turn off hierarchy
   *   /\// - split by `/`
   *   /\./ - split by `.`
   *   /\/|\./ - split by `/` or `.`
   * @type {Regex}
   */
  hierarchySeparator: /\/|\./, // matches a . or /
  /**
   * regex for finding the hierarchy root separator
   * @example:
   *   null - turn off multiple hierarchy roots
   *   /\|/ - split by `|`
   * @type {Regex}
   */
  hierarchyRootSeparator: /\|/, //matches a |
  /**
   * sidebar tree animations
   * @type {Boolean}
   */
  sidebarAnimations: true,
  /**
   * id to select an addon panel
   * @type {String}
   */
  selectedAddonPanel: undefined, // The order of addons in the "Addon panel" is the same as you import them in 'addons.js'. The first panel will be opened by default as you run Storybook
  /**
   * enable/disable shortcuts
   * @type {Boolean}
   */
  enableShortcuts: false // true by default
});

configure(loadStories, module);
