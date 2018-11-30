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

import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {action, configureActions} from '@storybook/addon-actions';
import StoryRouter from 'storybook-react-router';

import PostChangeRedirect from './PostChangeRedirect';
import library from '../../startup/icons';
import '../../styles/index.css';
import './ChangePassword.css';

const stories = storiesOf('PostChangeRedirect', module);

const redirectUrl = 'http%3A%2F%2Flocalhost%3A9001%2F%3FselectedKind%3DPostChangeRedirect%26selectedStory%3Dbasic%26full%3D0%26addons%3D1%26stories%3D1%26panelRight%3D0%26addonPanel%3Dstorybook%252Factions%252Factions-panel'

// NB: The redirect here doesn't work properly. It redirects within the same window.
stories.addDecorator(
  StoryRouter(
    {},
    {
      initialEntries: [{search:`redirect_url=${redirectUrl}`}],
    },
  ),
);

stories.add('basic', () => <PostChangeRedirect />);
