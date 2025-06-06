import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ onSearch }: { onSearch: (value: string) => void }) => (
  <div>
    <Header onSearch={onSearch} />
    <Outlet />
  </div>
);

export default AdminLayout;
