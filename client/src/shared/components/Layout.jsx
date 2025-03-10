import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";
import SideBar from "../../chat/components/SideBar/SideBar";
import UIStore from "../../store/UIStore";
import MainStore from "../../store/MainStore";

const Layout = observer(() => {
  const handleClickOutside = (e) => {
    e.preventDefault();
    MainStore.resetMenus();
    UIStore.resetMenus()
  };

  return (
    <div className="chat" onClick={handleClickOutside} onContextMenu={handleClickOutside}>
      <SideBar />
      <Outlet />
    </div>
  );
});
export default Layout