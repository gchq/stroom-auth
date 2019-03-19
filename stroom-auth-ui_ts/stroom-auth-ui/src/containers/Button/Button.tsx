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
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { ButtonProps } from "./types";

export const Button = ({
  text,
  icon,
  className: rawClassName,
  groupPosition,
  circular,
  selected,
  size,
  ...rest
}: ButtonProps) => {
  const className = useMemo(() => {
    let classNames = ["button"];

    if (rawClassName) classNames.push(rawClassName);
    if (groupPosition) classNames.push(groupPosition);
    if (circular) classNames.push("circular");
    if (text) classNames.push("has-text");
    if (selected) classNames.push("selected");

    return classNames.join(" ");
  }, [rawClassName, groupPosition, circular, text, selected]);

  let fontAwesomeSize: SizeProp = useMemo(() => {
    switch (size) {
      case "small":
        return "sm";
      case "medium":
        return "1x";
      case "large":
        return "lg";
      case "xlarge":
        return "2x";
      default:
        fontAwesomeSize = "1x";
    }
    return "sm";
  }, [size]);

  return (
    <button className={className} {...rest}>
      {icon ? (
        <FontAwesomeIcon size={fontAwesomeSize} icon={icon} />
      ) : (
        undefined
      )}
      {text ? <span className="button__text">{text}</span> : undefined}
    </button>
  );
};

export default Button;
