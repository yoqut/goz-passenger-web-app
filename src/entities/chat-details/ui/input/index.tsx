import { Button } from "@/shared/ui/buttons/button";
import { Send01 } from "@untitledui/icons";
import type { InputProps as InputProperties } from "../../models";

export const MessageInput = ({ onInputChange, onSubmit }: InputProperties) => {
  // const fileInput = useRef<HTMLInputElement>(null)

  // const handleFileSelect = () => {
  //   fileInput.current?.click()
  // }

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   onSelectAttachment?.((event.target.files || [])[0])
  // }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="w-full flex items-center gap-2 "
    >
      {/* <div className="rounded-xl flex-1 border overflow-hidden pr-2 border-gray-400 flex items-center gap-2">
        <label htmlFor="attachment" className="cursor-pointer">
          <Button color='tertiary' onClick={handleFileSelect} >
            <Attachment02 className="text-blue-primary" />
          </Button>
        </label>

        <input ref={fileInput} id="attachment" type="file" className="hidden" onChange={handleFileChange} />
      </div> */}
      <input
        name="message"
        type="text"
        className="outline-none border p-2 border-gray-400 h-full flex-1 rounded-xl"
        placeholder="Type your message"
        onChange={(e) => onInputChange?.(e.target.value)}
      />
      <Button
        type="submit"
        color="tertiary"
        size="sm"
        className="bg-blue-primary rounded-xl size-10 hover:bg-blue-primary"
      >
        <Send01 className="text-white" />
      </Button>
    </form>
  );
};
