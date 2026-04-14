import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-screen min-h-screen overflow-y-auto">
      <Outlet />
    </div>
  );
};

export default Layout;