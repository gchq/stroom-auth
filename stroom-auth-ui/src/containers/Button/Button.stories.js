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

import Button from './Button';
import library from '../../startup/icons';
import '../../styles/index.css';

const stories = storiesOf('Button', module);

stories.add('simple', () => <Button>A thing</Button>);

stories.add('icon', () => <Button icon="times">A thing</Button>);

stories.add('disabled', () => (
  <Button disabled icon="times">
    A thing
  </Button>
));

stories.add('with onClick', () => (
  <Button onClick={action('clicked')}>A button</Button>
));

stories.add('isLoading', () => (
  <div>
    <Button className="primary" icon='times' disabled isLoading={true}>A loading button</Button>
    <Button className="primary" icon='times'>A loading button</Button>
  </div>
));


stories.add('isLoading no icon - it changes size', () => (
  <div>
    <Button className="primary" icon='times' disabled isLoading={true}>A loading button</Button>
    <Button className="primary" >A loading button</Button>
  </div>
));

stories.add('with toolbar-button-small', () => (
  <div>
    <Button className="primary toolbar-button-small" icon='times' disabled isLoading={true}>A loading button</Button>
    <Button className="primary toolbar-button-small" >A loading button</Button>
    <Button className="primary toolbar-button-small" icon="arrow-left">A loading button</Button>
              <Button
                className="primary toolbar-button-small" icon='arrow-left'>
                 Back
              </Button>
  </div>
));

