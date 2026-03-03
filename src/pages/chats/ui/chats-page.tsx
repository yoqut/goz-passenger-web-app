import { UserCard } from "@/entities/chat/ui";
import { Container } from "@/shared/ui/container/container";
import { Input } from "@/shared/ui/input/input";
import { SearchMd } from "@untitledui/icons";

export const ChatsPage = () => {
  return (
    <Container className="p-0 h-full flex flex-col overflow-y-hidden">
      <div className="py-2">
        <h1 className="text-xl text-center text-gray-900 font-semibold">
          Chat
        </h1>
        <Input
          icon={SearchMd}
          placeholder="Search"
          wrapperClassName="mt-3 focus-within:ring-blue-primary"
          className={"px-4"}
        />
      </div>
      <div className="px-3 space-y-3 pb-4 flex-1 overflow-y-auto">
        <UserCard
          id={2}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
        <UserCard
          id={4}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
        <UserCard
          id={5}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
        <UserCard
          id={2}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
        <UserCard
          id={2}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
        <UserCard
          id={2}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
        <UserCard
          id={2}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
        <UserCard
          id={2}
          name="Olivia Rhye"
          time="10:30"
          message="Status indicators are a common way to show the online or offline status of a user or connection"
          count={4}
        />
      </div>
    </Container>
  );
};
