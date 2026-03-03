// input 
export interface InputProps {
  onInputChange?: (value: string) => void;
  onSubmit?: () => void;
  onSelectAttachment?: (data: File) => void;
}

export interface MessageProps {
  text?: string;
  time: string;
  isSender: boolean;
}