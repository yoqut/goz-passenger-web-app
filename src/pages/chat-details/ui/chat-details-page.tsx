import { MessageList } from "@/entities/chat-details/ui";
import { Avatar } from "@/shared/ui/avatar/avatar";
import { Container } from "@/shared/ui/container/container";
import { ChevronLeft } from "@untitledui/icons";
import { Link } from "react-router-dom";

export const ChatDetailsPage = () => {
  return (
    <Container className="flex flex-col p-4 bg-primary h-screen">
      <div className="flex items-center gap-2 ">
        <Link to={"/chat"} className="p-2">
          <ChevronLeft />
        </Link>
        <Avatar
          size="md"
          alt="Olivia Rhye"
          src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
        />
        <p className="text-lg text-gray-700 font-semibold">Olivia Rhye</p>
      </div>
      <div className="flex-1 flex flex-col justify-end py-4 overflow-y-hidden">
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          <MessageList />
        </div>
      </div>
    </Container>
  );
};
