import { LightMainLogo } from "@/app/assets";
import { Loading01 } from "@untitledui/icons";
import { Container } from "../container/container";

export const PageLoader = () => {
  return (
    <div className="flex bg-active h-screen w-full flex-col items-center justify-between">
      <Container size="md" className="h-full flex flex-col justify-end">
        <div className="flex flex-1 items-center justify-center">
          <LightMainLogo />
        </div>
        <div className="flex items-center justify-center py-2">
          <Loading01 className="size-5 transform animate-spin text-blue-primary" />
        </div>
      </Container>
    </div>
  );
};
