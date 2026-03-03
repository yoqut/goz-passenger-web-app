import { Loading02 } from "@untitledui/icons";

interface Properties {
  onClick?: () => void;
  text?: string | React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "link-gray"
    | "link-color"
    | "primary-destructive"
    | "secondary-destructive"
    | "tertiary-destructive"
    | "link-destructive";
  type?: "submit" | "reset" | "button";
}

const DefaultButton = ({
  onClick,
  type,
  text,
  className,
  icon,
  isDisabled,
  isLoading,
  color,
}: Properties) => {
  return (
    <button
      className={`mb-5 w-full py-4 flex justify-center text-center rounded-xl ring-white border-none outline-0 outline-none transition-all duration-200 ${
        isDisabled
          ? "bg-gray-300 cursor-not-allowed opacity-60"
          : "bg-blue-primary "
      } ${className}`}
      onClick={onClick}
      color={color}
      type={type || "button"}
      disabled={isDisabled}
    >
      {isLoading ? (
        <Loading02 className="transofrm animate-spin" color="white" />
      ) : (
        <span
          className={`flex items-center justify-center gap-2 w-full ${isDisabled ? "text-gray-500" : "text-white"}`}
        >
          {icon && icon}
          {text}
        </span>
      )}
    </button>
  );
};

export default DefaultButton;
