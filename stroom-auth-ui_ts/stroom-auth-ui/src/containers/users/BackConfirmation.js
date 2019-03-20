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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'ramda';

import './BackConfirmation.css';

export default ({
  isOpen,
  onGoBack,
  onContinueEditing,
  onSaveAndGoBack,
  errors,
}) => {
  return (
    <ReactModal
      className="BackConfirmation"
      isOpen={isOpen}
      contentLabel="Are you sure?">
      <h3>
        <FontAwesomeIcon icon="exclamation-triangle" /> You have unsaved
        changes!
      </h3>
      <p>Are you sure you want to go back?</p>
      {!isEmpty(errors) ? (
        <p className="warning">There are validation issues with this data and we can't save it.</p>
      ) : (
          undefined
        )}
      <div className="BackConfirmation__actions">

        <button
          className="toolbar-button-large primary"
          type="button"
          onClick={onGoBack}>
          <FontAwesomeIcon icon="trash" /> Yes, discard changes
        </button>

        <button
          className="toolbar-button-large primary"
          type="button"
          disabled={!isEmpty(errors)}
          onClick={onSaveAndGoBack}>
          <FontAwesomeIcon icon="save" /> Yes, save changes
          </button>

        <button
          className="toolbar-button-large primary"
          type="button"
          onClick={onContinueEditing}>
          <FontAwesomeIcon icon="times" /> No, continue editing
        </button>

      </div>
    </ReactModal>
  );
};
