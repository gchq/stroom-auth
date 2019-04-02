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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as CopyToClipboard from "react-copy-to-clipboard";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "rc-checkbox/assets/index.css";

import Button from "../Button";
import Loader from "../Loader2";
import "./TokenEdit.css";
import "../../styles/form.css";
import { OnCopy, ByCopy } from "../auditCopy";

import { useTokens } from "../../api/tokens";
import useIdFromPath from "src/lib/useIdFromPath";
import { useRouter } from "src/lib/useRouter";
import { useReduxState } from "src/lib/useReduxState";

const EditToken = () => {
  const { token } = useReduxState(({ token: { lastReadToken } }) => ({
    token: lastReadToken
  }));
  const { history } = useRouter();
  const { toggleEnabledState } = useTokens();

  const { fetchApiKey } = useTokens();
  const tokenId = useIdFromPath("token/");
  React.useEffect(() => {
    if (!!tokenId) {
      fetchApiKey(tokenId);
    }
  }, [tokenId]);

  return (
    <form>
      <div className="header">
        <button
          className="primary toolbar-button-small"
          onClick={() => history.push("/tokens")}
        >
          <FontAwesomeIcon icon="arrow-left" /> Back
        </button>
      </div>
      {token === undefined ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
          <div className="container">
            <div className="section">
              <div className="section__title">
                <h3>Details</h3>
              </div>
              <div className="section__fields">
                <div className="section__fields__row">
                  <div className="field-container">
                    <div className="label-container">
                      <label>Enabled</label>
                    </div>
                    <Toggle
                      icons={false}
                      checked={token.enabled}
                      onChange={event =>
                        !!tokenId ? toggleEnabledState() : undefined
                      }
                    />
                  </div>
                </div>
                <ByCopy by={token.user_email} verb="Issued to" />
                <OnCopy on={token.expires_on} verb="Expires" />
              </div>
            </div>
            <div className="section">
              <div className="section__title">
                <h3>Audit</h3>
              </div>
              <div className="section__fields">
                <OnCopy on={token.issued_on} verb="Issued" />
                <ByCopy by={token.issued_by_user} verb="Issued by" />
                <OnCopy on={token.updated_on} verb="Updated" />
                <ByCopy by={token.updated_by_user} verb="Updated by" />
              </div>
            </div>
            <div className="section">
              <div className="section__title">
                <h3>API key</h3>
              </div>
              <div className="section__fields--copy-only constrained">
                <textarea value={token.token} disabled />
                <CopyToClipboard text={token.token}>
                  <Button
                    type="button"
                    className="primary"
                    icon="copy"
                    text="Copy key"
                  />
                </CopyToClipboard>
              </div>
            </div>
          </div>
        )}
    </form>
  );
};

export default EditToken;
