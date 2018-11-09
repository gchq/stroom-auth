/*
 * Copyright 2017 Crown Copyright
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

import React from 'react';
import ReactModal from 'react-modal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default  ({isOpen, onGoBack, onContinueEditing}) => {
  return (
    <ReactModal
      className="confirmation"
      isOpen={isOpen}
      contentLabel="Are you sure?">
      <h3>
        <FontAwesomeIcon icon="exclamation-triangle" /> You have unsaved
        changes!
      </h3>
      <p>Are you sure you want to go back?</p>
      <div className="confirmation__actions">
        <button className="toolbar-button-large primary" type='button' onClick={onGoBack}>
          <FontAwesomeIcon icon="times" /> Yes, discard changes
        </button>
        <button className="toolbar-button-large secondary" type='button' onClick={onContinueEditing}>
          <FontAwesomeIcon icon="check" /> No, continue editing
        </button>
      </div>
    </ReactModal>
  );
};
