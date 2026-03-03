import { cx } from "@/shared/lib/utils/cx";
import { XClose } from "@untitledui/icons";
import type { ReactNode } from "react";
import { Sheet, type SheetProps } from "react-modal-sheet";

interface BottomSheetProperties extends SheetProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  closeButton?: boolean;
}

export const BottomSheet = ({
  title,
  description,
  children,
  closeButton = true,
  className,
  headerClassName,
  contentClassName,
  disableDrag = false,
  onClose,
  ...props
}: BottomSheetProperties) => {
  return (
    <Sheet
      onClose={onClose}
      disableDrag={disableDrag}
      detent="content"
      {...props}
    >
      <Sheet.Backdrop
        style={{
          backdropFilter: "blur(.4px)",
          backgroundColor: "rgba(38, 38, 38, .7)",
        }}
        onClick={(event) => event.stopPropagation()}
      />
      <Sheet.Container
        className={cx(
          " bg-white shadow-lg pointer-events-auto w-screen",
          className
        )}
        style={{
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      >
        <Sheet.Header
          className={cx(
            "flex flex-col gap-2 relative  py-2 border-gray-200 px-4",
            headerClassName
          )}
        >
          {!disableDrag && (
            <span className="absolute  top-3 bg-gray-200 rounded-md w-10 h-1  left-1/2 transform -translate-x-1/2" />
          )}
          <div className={`flex ${title ? "justify-between" : "justify-end"} `}>
            {title && (
              <h2 className="text-lg mt-3 font-semibold text-primary">
                {title}
              </h2>
            )}
            {closeButton && disableDrag && <XClose onClick={onClose} />}
          </div>
          {description && (
            <p className="text-sm text-tertiary">{description}</p>
          )}
        </Sheet.Header>

        <Sheet.Content
          className={cx("overflow-y-auto px-4 py-4", contentClassName)}
        >
          {children}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
};
