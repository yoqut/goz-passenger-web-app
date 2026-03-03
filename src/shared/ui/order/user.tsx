import { StarIcon } from "@/app/assets";
import { UserImage } from "@/app/assets/images";
import { MessageChatCircle, PhoneCall01 } from "@untitledui/icons";
import { useTranslation } from "react-i18next";
import { Avatar } from "../avatar/avatar";
import { Button } from "../buttons/button";

interface IUserProps {
  image?: string;
  rate?: number | string;
  name?: string;
  phone?: string;
  status?: "offline" | "online" | undefined;
  onMessageClick?: () => void;
}

export const User = ({
  name,
  image,
  rate,
  phone,
  status,
  onMessageClick,
}: IUserProps) => {
  const { t } = useTranslation();
  const defaultName = t("user.defaultName");

  // Clean phone number for tel: link (remove spaces, dashes, etc.)
  // Keep only digits and + sign
  const cleanPhone = phone?.replace(/[^\d+]/g, "") || "";
  // Ensure phone starts with +, if not add it
  const formattedPhone = cleanPhone.startsWith("+")
    ? cleanPhone
    : cleanPhone.startsWith("998")
      ? `+${cleanPhone}`
      : `+998${cleanPhone}`;

  const telLink = formattedPhone ? `tel:${formattedPhone}` : "";

  return (
    <div className="flex items-center gap-2">
      <Avatar
        size="md"
        alt={defaultName}
        status={status}
        src={image || UserImage}
      />
      <div className="flex-1">
        <p className="text-md font-semibold text-gray-900">
          {name || defaultName}
        </p>
        <div className="flex items-center gap-1">
          <StarIcon width={18} height={18} />
          <p className="text-sm text-gray-900 font-normal">{rate || "0"}</p>
        </div>
      </div>
      <div className="flex items-center">
        {phone && cleanPhone && (
          <a
            target="_blank"
            rel="noopener"
            href={telLink}
            className="p-1 cursor-pointer inline-flex items-center justify-center touch-callout-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <PhoneCall01
              width={28}
              height={28}
              strokeWidth="1"
              className="text-blue-primary"
            />
          </a>
        )}
        <Button onClick={onMessageClick} color="tertiary" className="p-1">
          <MessageChatCircle
            width={28}
            height={28}
            strokeWidth="1"
            className="text-blue-primary"
          />
        </Button>
      </div>
    </div>
  );
};
