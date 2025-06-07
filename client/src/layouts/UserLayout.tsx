import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";
const UserLayout = ({ onSearch }: { onSearch: (value: string) => void }) => (
  <div>
    <Header onSearch={onSearch} />
    <Outlet />
  </div>
);

export default UserLayout;