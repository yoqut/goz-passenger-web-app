/* eslint-disable unicorn/no-null */
import { cx } from "@/shared/lib/utils/cx";
import {
  type ReactNode,
  type Ref,
  type SVGProps,
  createContext,
  useContext,
} from "react";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProperties,
  type RadioProps as AriaRadioProperties,
} from "react-aria-components";

export interface RadioGroupContextType {
  size?: "sm" | "md";
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export interface RadioButtonBaseProperties {
  size?: "sm" | "md";
  className?: string;
  isFocusVisible?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export const RadioButtonBase = ({
  className,
  isFocusVisible,
  isSelected,
  isDisabled,
  size = "sm",
}: RadioButtonBaseProperties) => {
  return (
    <div
      className={cx(
        "flex size-4 min-h-4 min-w-4 cursor-pointer appearance-none items-center justify-center rounded-full bg-primary ring-1 ring-primary ring-inset",
        size === "md" && "size-5 min-h-5 min-w-5",
        isSelected &&
          !isDisabled &&
          "bg-[#2299D5] ring-bg-[#2299D5] border-[#2299D5] outline-[#2299D5] ring-0",
        isDisabled && "cursor-not-allowed border-disabled bg-disabled_subtle",
        isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
        className
      )}
    >
      <div
        className={cx(
          "size-1.5 rounded-full bg-fg-white opacity-0 transition-inherit-all",
          size === "md" && "size-2",
          isDisabled && "bg-fg-disabled_subtle",
          isSelected && "opacity-100"
        )}
      />
    </div>
  );
};
RadioButtonBase.displayName = "RadioButtonBase";

interface RadioButtonProperties extends AriaRadioProperties {
  size?: "sm" | "md";
  label?: ReactNode;
  hint?: ReactNode;
  ref?: Ref<HTMLLabelElement>;
  icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
}

export const RadioButton = ({
  label,
  hint,
  className,
  icon,
  size = "sm",
  ...ariaRadioProperties
}: RadioButtonProperties) => {
  const context = useContext(RadioGroupContext);

  size = context?.size ?? size;

  const sizes = {
    sm: {
      root: "gap-2",
      textWrapper: "",
      label: "text-sm font-normal",
      hint: "text-sm",
    },
    md: {
      root: "gap-3",
      textWrapper: "gap-0.5",
      label: "text-md font-normal",
      hint: "text-md",
    },
  };

  return (
    <AriaRadio
      {...ariaRadioProperties}
      className={(renderProperties) =>
        cx(
          "flex items-start justify-between",
          renderProperties.isDisabled && "cursor-not-allowed",
          sizes[size].root,
          typeof className === "function"
            ? className(renderProperties)
            : className
        )
      }
    >
      {({ isSelected, isDisabled, isFocusVisible }) => {
        const Icon = icon;
        return (
          <>
            <div className="flex gap-3">
              {Icon && (
                <div className="flex items-center justify-center">
                  <Icon />
                </div>
              )}
              {(label || hint) && (
                <div
                  className={cx(
                    "align-start inline-flex",
                    sizes[size].textWrapper
                  )}
                >
                  {label && (
                    <p
                      className={cx(
                        "text-left text-secondary select-none",
                        sizes[size].label
                      )}
                    >
                      {label}
                    </p>
                  )}
                  {hint && (
                    <span
                      className={cx("text-tertiary", sizes[size].hint)}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {hint}
                    </span>
                  )}
                </div>
              )}
            </div>
            <RadioButtonBase
              size={size}
              isSelected={isSelected}
              isDisabled={isDisabled}
              isFocusVisible={isFocusVisible}
              className={label || hint ? "mt-0.5" : ""}
            />
          </>
        );
      }}
    </AriaRadio>
  );
};
RadioButton.displayName = "RadioButton";

interface RadioGroupProperties
  extends RadioGroupContextType,
    AriaRadioGroupProperties {
  children: ReactNode;
  className?: string;
}

export const RadioGroup = ({
  children,
  className,
  size = "sm",
  ...properties
}: RadioGroupProperties) => {
  return (
    <RadioGroupContext.Provider value={{ size }}>
      <AriaRadioGroup
        {...properties}
        className={cx("flex flex-col gap-4", className)}
      >
        {children}
      </AriaRadioGroup>
    </RadioGroupContext.Provider>
  );
};
