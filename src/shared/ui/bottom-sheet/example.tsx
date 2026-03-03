import DefaultButton from "@/shared/ui/default-button";
import { useState } from "react";
import { BottomSheet } from "./bottom-sheet";

export const BottomSheetExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DefaultButton text="Open BottomSheet" onClick={() => setIsOpen(true)} />

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Option"
        description="Choose one of the options below"
      >
        <div className="flex flex-col gap-3">
          <button className="rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors hover:bg-blue-600">
            Option 1
          </button>
          <button className="rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors hover:bg-blue-600">
            Option 2
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-primary transition-colors hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </BottomSheet>
    </>
  );
};
