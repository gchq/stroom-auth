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
import { useEffect } from "react";
import { storiesOf } from "@storybook/react";

import ErrorPage from "./ErrorPage";
import { useActionCreators } from "./redux";

const errorMessage = "Everything is a disaster";
const stackTrace = `Invariant Violation: Objects are not valid as a React child (found: object with keys {sdfs}). If you meant to render a collection of children, use an array instead.
in code (created by ErrorPage)
in p (created by ErrorPage)
in div (created by ErrorPage)
in div (created by ErrorPage)
in div (created by ErrorPage)
in ErrorPage (created by Connect(ErrorPage))
in Connect(ErrorPage)
in div
in TestInitialisationDecorator (created by Connect(TestInitialisationDecorator))
in Connect(TestInitialisationDecorator)
in Provider
at invariant (http://localhost:9001/static/preview.bundle.js:3417:15)
at throwOnInvalidObjectType (http://localhost:9001/static/preview.bundle.js:35515:5)
at reconcileChildFibers (http://localhost:9001/static/preview.bundle.js:36282:7)
at reconcileChildrenAtExpirationTime (http://localhost:9001/static/preview.bundle.js:36393:30)
at reconcileChildren (http://localhost:9001/static/preview.bundle.js:36384:5)
at updateHostComponent (http://localhost:9001/static/preview.bundle.js:36692:5)
at beginWork (http://localhost:9001/static/preview.bundle.js:37139:16)
at performUnitOfWork (http://localhost:9001/static/preview.bundle.js:39967:16)
at workLoop (http://localhost:9001/static/preview.bundle.js:39996:26)
at renderRoot (http://localhost:9001/static/preview.bundle.js:40027:9)`;
const httpErrorStatus = 501;

interface Props {
  _errorMessage?: string;
  _stackTrace?: string;
  _httpErrorStatus?: number;
}

const TestErrorPage = ({
  _errorMessage,
  _stackTrace,
  _httpErrorStatus
}: Props) => {
  const {
    setErrorMessage,
    setStackTrace,
    setHttpErrorCode
  } = useActionCreators();
  useEffect(() => {
    if (!!_errorMessage) setErrorMessage(_errorMessage);
    if (!!_stackTrace) setStackTrace(_stackTrace);
    if (!!_httpErrorStatus) setHttpErrorCode(_httpErrorStatus);
  }, [
    setErrorMessage,
    setStackTrace,
    setHttpErrorCode,
    _errorMessage,
    _stackTrace,
    _httpErrorStatus
  ]);

  return <ErrorPage />;
};

storiesOf("Sections/ErrorPage", module)
  .add("No details", () => <TestErrorPage />)
  .add("Just error message", () => (
    <TestErrorPage _errorMessage={errorMessage} />
  ))
  .add("Error message and stack trace", () => (
    <TestErrorPage _errorMessage={errorMessage} _stackTrace={stackTrace} />
  ))
  .add("Everything", () => (
    <TestErrorPage
      _errorMessage={errorMessage}
      _stackTrace={stackTrace}
      _httpErrorStatus={httpErrorStatus}
    />
  ));
