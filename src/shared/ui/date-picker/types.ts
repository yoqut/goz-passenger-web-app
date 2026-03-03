/**
 * DatePicker component props
 */
export interface DatePickerProperties {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
}
