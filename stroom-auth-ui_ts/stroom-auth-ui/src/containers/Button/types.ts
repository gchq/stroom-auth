import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type IconSize = "small" | "medium" | "large" | "xlarge";

/**
 * Button Properties
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The Font Awesome Icon to use */
  icon?: IconProp;
  /** Indicates how to style the button within a group (left | middle | right)  */
  groupPosition?: string;
  /** Make the button circular */
  circular?: boolean;
  /** Place this text on the button */
  text?: string;
  /** Indicate the button has been selected */
  selected?: boolean;
  /** Custom additional class to apply to the button */
  className?: string;
  /** The size of the icon*/
  size?: IconSize;
}
