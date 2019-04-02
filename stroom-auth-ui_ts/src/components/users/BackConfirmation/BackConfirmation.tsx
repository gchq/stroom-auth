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

import * as React from "react";
import * as ReactModal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormikErrors } from "formik";
import { isEmpty } from "ramda";

import Button from "src/components/Button";

import { User } from "../types";
import "./BackConfirmation.css";

const BackConfirmation = ({
  isOpen,
  onGoBack,
  onContinueEditing,
  onSaveAndGoBack,
  errors
}: {
  isOpen: boolean;
  onGoBack: Function;
  onContinueEditing: Function;
  onSaveAndGoBack: Function;
  errors: FormikErrors<User>;
}) => {
  return (
    <ReactModal
      className="BackConfirmation"
      isOpen={isOpen}
      contentLabel="Are you sure?"
    >
      <h3>
        <FontAwesomeIcon icon="exclamation-triangle" /> You have unsaved
        changes!
      </h3>
      <p>Are you sure you want to go back?</p>
      {!isEmpty(errors) ? (
        <p className="warning">
          There are validation issues with this data and we can't save it.
        </p>
      ) : (
          undefined
        )}
      <div className="BackConfirmation__actions">
        <Button
          className="toolbar-button-large primary"
          type="button"
          onClick={() => onGoBack()}
          icon="trash"
          text="Yes, discard changes"
        />

        <Button
          className="toolbar-button-large primary"
          type="button"
          disabled={!isEmpty(errors)}
          onClick={() => onSaveAndGoBack()}
          icon="save"
          text="Yes, save changes"
        />

        <Button
          className="toolbar-button-large primary"
          type="button"
          onClick={() => onContinueEditing()}
          icon="times"
          text="No, continue editing"
        />
      </div>
    </ReactModal>
  );
};

export default BackConfirmation;
