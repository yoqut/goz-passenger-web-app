/* eslint-disable react-refresh/only-export-components */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-nested-ternary */
import { cx } from "@/shared/lib/utils/cx";
import { isReactComponent } from "@/shared/lib/utils/is-react-component";
import { ChevronDown, XClose } from "@untitledui/icons";
import type { FC, ReactNode, Ref, RefAttributes } from "react";
import { createContext, isValidElement } from "react";
import type { SelectProps as AriaSelectProperties } from "react-aria-components";
import {
  Button as AriaButton,
  FieldError as AriaFieldError,
  ListBox as AriaListBox,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
} from "react-aria-components";
import { Avatar } from "../avatar/avatar";
import { HintText } from "../input/hint-text";
import { Label } from "../input/label";
import { ComboBox } from "./combobox";
import { Popover } from "./popover";
import { SelectItem } from "./select-item";

export type SelectItemType = {
  id: string;
  label?: string;
  avatarUrl?: string;
  isDisabled?: boolean;
  supportingText?: string;
  route_id?: number | string | null;
  cashback?: number;
  icon?: FC | ReactNode;
};

export interface CommonProperties {
  hint?: string;
  label?: string;
  tooltip?: string;
  size?: "sm" | "md";
  placeholder?: string;
  allowClear?: boolean;
}

interface SelectProperties
  extends Omit<AriaSelectProperties<SelectItemType>, "children" | "items">,
    RefAttributes<HTMLDivElement>,
    CommonProperties {
  items?: SelectItemType[];
  popoverClassName?: string;
  placeholderIcon?: FC | ReactNode;
  children: ReactNode | ((item: SelectItemType) => ReactNode);
}

interface SelectValueProperties {
  isOpen: boolean;
  size: "sm" | "md";
  isFocused: boolean;
  isDisabled: boolean;
  placeholder?: string;
  ref?: Ref<HTMLButtonElement>;
  placeholderIcon?: FC | ReactNode;
  allowClear?: boolean;
  onClear?: () => void;
}

export const sizes = {
  sm: { root: "py-2 px-3", shortcut: "pr-2.5" },
  md: { root: "py-2.5 px-3.5", shortcut: "pr-3" },
};

const SelectValue = ({
  isOpen,
  isFocused,
  isDisabled,
  size,
  placeholder,
  placeholderIcon,
  ref,
  allowClear,
  onClear,
}: SelectValueProperties) => {
  return (
    <div className="relative">
      <AriaButton
        ref={ref}
        className={cx(
          "relative flex w-full  h-[52px] cursor-pointer items-center rounded-lg bg-primary shadow-xs ring-1 ring-primary outline-hidden transition duration-100 ease-linear ring-inset",
          (isFocused || isOpen) && "ring-2 ring-[#2299D5]",
          isDisabled && "cursor-not-allowed bg-disabled_subtle text-disabled"
        )}
      >
        <AriaSelectValue<SelectItemType>
          className={cx(
            "flex h-max w-full items-center justify-start gap-2 truncate text-left align-middle",

            // Icon styles
            "*:data-icon:size-5 *:data-icon:shrink-0 *:data-icon:text-fg-quaternary in-disabled:*:data-icon:text-fg-disabled",

            sizes[size].root
          )}
        >
          {(state) => {
            const Icon = state.selectedItem?.icon || placeholderIcon;
            const hasValue = !!state.selectedItem;

            return (
              <>
                {state.selectedItem?.avatarUrl ? (
                  <Avatar
                    size="xs"
                    src={state.selectedItem.avatarUrl}
                    alt={state.selectedItem.label}
                  />
                ) : isReactComponent(Icon) ? (
                  <Icon data-icon aria-hidden="true" />
                ) : isValidElement(Icon) ? (
                  Icon
                ) : null}

                {state.selectedItem ? (
                  <section className="flex w-full gap-2 truncate">
                    <p className="truncate text-md font-medium text-primary">
                      {state.selectedItem?.label}
                    </p>
                    {state.selectedItem?.supportingText && (
                      <p className="text-md text-tertiary">
                        {state.selectedItem?.supportingText}
                      </p>
                    )}
                  </section>
                ) : (
                  <p
                    className={cx(
                      "text-md text-placeholder",
                      isDisabled && "text-disabled"
                    )}
                  >
                    {placeholder}
                  </p>
                )}

                {allowClear && hasValue && !isDisabled ? null : (
                  <ChevronDown
                    aria-hidden="true"
                    className={cx(
                      "ml-auto shrink-0 text-fg-quaternary",
                      size === "sm" ? "size-5 stroke-[2.5px]" : "size-5"
                    )}
                  />
                )}
              </>
            );
          }}
        </AriaSelectValue>
      </AriaButton>

      {allowClear && (
        <AriaSelectValue<SelectItemType>>
          {(state) => {
            const hasValue = !!state.selectedItem;
            return hasValue && !isDisabled ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear?.();
                }}
                className={cx(
                  "absolute right-3 top-1/2 -translate-y-1/2 z-10 text-fg-quaternary hover:text-fg-secondary transition-colors p-1",
                  size === "sm" ? "size-8" : "size-10"
                )}
                aria-label="Clear selection"
              >
                <XClose className="size-full" />
              </button>
            ) : (
              ""
            );
          }}
        </AriaSelectValue>
      )}
    </div>
  );
};

export const SelectContext = createContext<{ size: "sm" | "md" }>({
  size: "sm",
});

const Select = ({
  placeholder = "Select",
  placeholderIcon,
  size = "sm",
  children,
  items,
  label,
  hint,
  tooltip,
  className,
  allowClear = false,
  ...rest
}: SelectProperties) => {
  return (
    <SelectContext.Provider value={{ size }}>
      <AriaSelect
        {...rest}
        validationBehavior="aria"
        className={(state) =>
          cx(
            "flex flex-col gap-1.5 ",
            typeof className === "function" ? className(state) : className
          )
        }
      >
        {(state) => (
          <>
            {label && (
              <Label isRequired={state.isRequired} tooltip={tooltip}>
                {label}
              </Label>
            )}

            <SelectValue
              {...state}
              {...{ size, placeholder }}
              placeholderIcon={placeholderIcon}
              allowClear={allowClear}
              onClear={() => {
                // Clear the selection by calling both onChange and onSelectionChange
                if (rest.onChange) {
                  rest.onChange(null as any);
                }
                if (rest.onSelectionChange) {
                  rest.onSelectionChange(null);
                }
              }}
            />

            <Popover size={size} className={rest.popoverClassName}>
              <AriaListBox items={items} className="size-full outline-hidden">
                {children}
              </AriaListBox>
            </Popover>

            {hint && <HintText isInvalid={state.isInvalid}>{hint}</HintText>}

            <AriaFieldError className="hidden" />
          </>
        )}
      </AriaSelect>
    </SelectContext.Provider>
  );
};

const _Select = Select as typeof Select & {
  ComboBox: typeof ComboBox;
  Item: typeof SelectItem;
};
_Select.ComboBox = ComboBox;
_Select.Item = SelectItem;

export { _Select as Select };
