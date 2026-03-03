import { Avatar } from "@/shared/ui/avatar/avatar";
import { Link } from "react-router-dom";
import type { UserCardProps as UserCardProperties } from "../../models/user-card";

export const UserCard = ({
  id,
  name,
  time,
  message,
  count,
}: UserCardProperties) => {
  return (
    <Link
      to={"/chat/" + id}
      className="flex flex-col border-b py-2 border-gray-200"
    >
      <div className="flex items-center gap-2 relative">
        <Avatar
          size="lg"
          alt="Olivia Rhye"
          src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
        />
        <p className="text-lg text-gray-700 font-semibold">{name}</p>
        {/* time */}
        <span className="absolute right-2 top-2 text-xs text-gray-600">
          {time}
        </span>
      </div>
      <div className="flex  gap-4 mt-2">
        <p className="text-xs text-gray-600 font-normal line-clamp-1 flex-1">
          {message}
        </p>
        <p className="flex items-center justify-center size-5 gap-2 bg-blue-primary p-2 rounded-full">
          <span className="text-xs text-white ">{count}</span>
        </p>
      </div>
    </Link>
  );
};
