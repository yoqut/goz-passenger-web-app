import type { MessageProps } from "../../models"

export const Message = ({ text, time, isSender }: MessageProps) => {
  switch (isSender) {
    case true:
      return (
        <div className="flex flex-col mb-2 items-start gap-2 pr-4">
          <p className="text-md bg-blue-primary p-3 rounded-t-xl rounded-br-xl text-white font-normal">{text}</p>
          <span className="text-xs text-gray-800">{time}</span>
        </div>
      )
    case false:
      return (
        <div className="flex flex-col mb-2 items-end gap-2 pl-4">
          <p className="text-md text-gray-800 bg-gray-100 p-3 rounded-t-xl rounded-bl-xl font-normal">{text}</p>
          <span className="text-xs text-gray-600">{time}</span>
        </div>
      )
  }
}