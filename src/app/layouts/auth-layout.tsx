import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-primary">
      <main className="mx-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
