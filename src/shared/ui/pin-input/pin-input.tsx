/* eslint-disable react-refresh/only-export-components */
import { cx } from "@/shared/lib/utils/cx";
import { OTPInput, OTPInputContext } from "input-otp";
import type { ComponentPropsWithRef } from "react";
import { createContext, useContext, useId } from "react";

type PinInputContextType = {
  size: "sm" | "md" | "lg";
  disabled: boolean;
  id: string;
};

const PinInputContext = createContext<PinInputContextType>({
  size: "sm",
  id: "",
  disabled: false,
});

export const usePinInputContext = () => {
  const context = useContext(PinInputContext);

  if (!context) {
    throw new Error(
      "The 'usePinInputContext' hook must be used within a '<PinInput />'"
    );
  }

  return context;
};

interface RootProperties extends ComponentPropsWithRef<"div"> {
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const Root = ({
  className,
  size = "md",
  disabled = false,
  ...properties
}: RootProperties) => {
  const id = useId();

  return (
    <PinInputContext.Provider value={{ size, disabled, id }}>
      <div
        role="group"
        className={cx("flex h-max flex-col gap-1.5", className)}
        {...properties}
      />
    </PinInputContext.Provider>
  );
};
Root.displayName = "Root";

type GroupProperties = ComponentPropsWithRef<typeof OTPInput> & {
  width?: number;
  inputClassName?: string;
};

const Group = ({
  inputClassName,
  containerClassName,
  width,
  maxLength = 4,
  ...properties
}: GroupProperties) => {
  const { id, size, disabled } = usePinInputContext();

  const heights = {
    sm: "h-16.5",
    md: "h-20.5",
    lg: "h-24.5",
  };

  return (
    <OTPInput
      {...properties}
      size={width}
      maxLength={maxLength}
      disabled={disabled}
      id={"pin-input-" + id}
      aria-label="Enter your pin"
      aria-labelledby={"pin-input-label-" + id}
      aria-describedby={"pin-input-description-" + id}
      containerClassName={cx(
        "flex flex-row gap-3",
        size === "sm" && "gap-2",
        heights[size],
        containerClassName
      )}
      className={cx("w-full! disabled:cursor-not-allowed", inputClassName)}
    />
  );
};
Group.displayName = "Group";

const sizes = {
  sm: "size-16 px-2 py-0.5 text-display-lg font-medium",
  md: "size-20 px-2 py-2.5 text-display-lg font-medium",
  lg: "size-24 px-2 py-3 text-display-xl font-medium",
};

const Slot = ({
  index,
  className,
  ...properties
}: ComponentPropsWithRef<"div"> & { index: number }) => {
  const { size, disabled } = usePinInputContext();
  const { slots, isFocused } = useContext(OTPInputContext);
  const slot = slots[index];

  return (
    <div
      {...properties}
      aria-label={"Enter digit " + (index + 1) + " of " + slots.length}
      className={cx(
        "relative flex items-center justify-center rounded-xl bg-primary text-center text-placeholder_subtle shadow-xs ring-1 ring-primary transition-[box-shadow,background-color] duration-100 ease-linear ring-inset",
        sizes[size],
        isFocused &&
          slot?.isActive &&
          "ring-2 ring-grey-800  outline-offset-2 outline-0",
        slot?.char && "text-grey-800 ring-1 ring-hrey-800",
        disabled && "bg-disabled_subtle text-fg-disabled_subtle ring-disabled",
        className
      )}
    >
      {slot?.char ?? (slot?.hasFakeCaret ? <FakeCaret size={size} /> : 0)}
    </div>
  );
};
Slot.displayName = "Slot";

const FakeCaret = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  return (
    <div
      className={cx(
        "pointer-events-none h-[1em] w-0.5 animate-caret-blink bg-fg-brand-primary",
        size === "lg"
          ? "text-display-xl font-medium"
          : "text-display-lg font-medium"
      )}
    />
  );
};

const Separator = (properties: ComponentPropsWithRef<"p">) => {
  return (
    <div
      role="separator"
      {...properties}
      className={cx(
        "text-center text-display-xl font-medium text-placeholder_subtle",
        properties.className
      )}
    >
      ) -
    </div>
  );
};
Separator.displayName = "Separator";

const Label = ({
  className,
  ...properties
}: ComponentPropsWithRef<"label">) => {
  const { id } = usePinInputContext();

  return (
    <label
      {...properties}
      htmlFor={"pin-input-" + id}
      id={"pin-input-label-" + id}
      className={cx("text-sm font-medium text-secondary", className)}
    />
  );
};
Label.displayName = "Label";

const Description = ({
  className,
  ...properties
}: ComponentPropsWithRef<"p">) => {
  const { id } = usePinInputContext();

  return (
    <p
      {...properties}
      id={"pin-input-description-" + id}
      role="description"
      className={cx("text-sm text-tertiary", className)}
    />
  );
};
Description.displayName = "Description";

const PinInput = Root as typeof Root & {
  Slot: typeof Slot;
  Label: typeof Label;
  Group: typeof Group;
  Separator: typeof Separator;
  Description: typeof Description;
};
PinInput.Slot = Slot;
PinInput.Label = Label;
PinInput.Group = Group;
PinInput.Separator = Separator;
PinInput.Description = Description;

export { PinInput };
