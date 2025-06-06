import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div>
    {/* <Header /> */}
    <Outlet />
  </div>
);

export default AdminLayout;