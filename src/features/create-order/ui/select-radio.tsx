import {
  RadioButton,
  RadioGroup,
} from "@/shared/ui/radio-buttons/radio-buttons";

export const CountSelectRadio = ({
  setCountClient,
  countClient,
}: {
  setCountClient: (value: string) => void;
  countClient: string;
}) => {
  // const { t } = useTranslation();
  const handleChange = (value: string) => {
    setCountClient(value);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <RadioGroup
        aria-label="Number of people"
        defaultValue="1"
        value={countClient}
        onChange={handleChange}
        className="flex flex-row justify-between gap-3 w-full"
      >
        {["1", "2", "3", "4"].map((item) => (
          <RadioButton
            key={item}
            label={item}
            value={item}
            className={({ isSelected }) =>
              `flex-1 text-center flex items-center justify-center px-4 py-3 rounded-lg border-0 transition-all gap-0 ${
                isSelected ? "bg-[#2299D5] [&_p]:text-white" : "bg-gray-100"
              } [&>div:last-child]:hidden`
            }
          />
        ))}
      </RadioGroup>
    </div>
  );
};
