/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable unicorn/no-null */
import { cx } from "@/shared/lib/utils/cx";
import { isReactComponent } from "@/shared/lib/utils/is-react-component";
import { Check } from "@untitledui/icons";
import { isValidElement, useContext } from "react";
import type { ListBoxItemProps as AriaListBoxItemProperties } from "react-aria-components";
import {
  ListBoxItem as AriaListBoxItem,
  Text as AriaText,
} from "react-aria-components";
import { Avatar } from "../avatar/avatar";
import type { SelectItemType } from "./select";
import { SelectContext } from "./select";

const sizes = {
  sm: "p-2 pr-2.5",
  md: "p-2.5 pl-2",
};

interface SelectItemProperties
  extends Omit<AriaListBoxItemProperties<SelectItemType>, "id">,
    SelectItemType {}

export const SelectItem = ({
  label,
  id,
  value,
  avatarUrl,
  supportingText,
  isDisabled,
  icon: Icon,
  className,
  children,
  ...properties
}: SelectItemProperties) => {
  const { size } = useContext(SelectContext);

  const labelOrChildren =
    label || (typeof children === "string" ? children : "");
  const textValue = supportingText
    ? labelOrChildren + " " + supportingText
    : labelOrChildren;

  return (
    <AriaListBoxItem
      id={id}
      value={
        value ?? {
          id,
          label: labelOrChildren,
          avatarUrl,
          supportingText,
          isDisabled,
          icon: Icon,
        }
      }
      textValue={textValue}
      isDisabled={isDisabled}
      {...properties}
      className={(state) =>
        cx(
          "w-full px-1.5 py-px outline-hidden",
          typeof className === "function" ? className(state) : className
        )
      }
    >
      {(state) => (
        <div
          className={cx(
            "flex cursor-pointer items-center gap-2 rounded-xl outline-hidden select-none",
            state.isSelected && "bg-active",
            state.isDisabled && "cursor-not-allowed",
            state.isFocused && "bg-primary_hover",
            state.isFocusVisible && "ring-2 ring-focus-ring ring-inset",

            // Icon styles
            "*:data-icon:size-5 *:data-icon:shrink-0 *:data-icon:text-fg-quaternary",
            state.isDisabled && "*:data-icon:text-fg-disabled",

            sizes[size]
          )}
        >
          {avatarUrl ? (
            <Avatar aria-hidden="true" size="xs" src={avatarUrl} alt={label} />
          ) : isReactComponent(Icon) ? (
            <Icon data-icon aria-hidden="true" />
          ) : isValidElement(Icon) ? (
            Icon
          ) : null}

          <div className="flex w-full min-w-0 flex-1 flex-wrap gap-x-2">
            <AriaText
              slot="label"
              className={cx(
                "truncate text-md font-medium whitespace-nowrap text-primary",
                state.isDisabled && "text-disabled"
              )}
            >
              {label ||
                (typeof children === "function" ? children(state) : children)}
            </AriaText>

            {supportingText && (
              <AriaText
                slot="description"
                className={cx(
                  "text-md whitespace-nowrap text-tertiary",
                  state.isDisabled && "text-disabled"
                )}
              >
                {supportingText}
              </AriaText>
            )}
          </div>

          {state.isSelected && (
            <Check
              aria-hidden="true"
              className={cx(
                "ml-auto text-[#2299D5]",
                size === "sm" ? "size-4 stroke-[2.5px]" : "size-5",
                state.isDisabled && "text-fg-disabled"
              )}
            />
          )}
        </div>
      )}
    </AriaListBoxItem>
  );
};
