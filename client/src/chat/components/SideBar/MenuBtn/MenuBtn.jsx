import { useEffect } from "react";
import MainStore from "../../../../store/MainStore";
import { observer } from "mobx-react";
import { CSSTransition } from "react-transition-group";
import Menu from "../../../../shared/components/Menu";
import UIStore from "../../../../store/UIStore";


const MenuButton = () => {
    useEffect(() => {
        document.querySelector(".menu-btn")?.classList[MainStore.isActiveMenu ? 'add' : 'remove']("close");
    }, [MainStore.isActiveMenu]);

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        UIStore.showSettingsMenu(!UIStore.modals.settingsMenu);
    };

    useEffect(() => {
        document.querySelector(".menu-btn")?.classList[MainStore.isActiveMenu ? 'add' : 'remove']("close");
    }, [MainStore.isActiveMenu]);

    const menuItems = [
        { 
            condition: true,
            action: () => UIStore.showSettingsModal(true),
            icon: <></>,
            text: 'settings'
        },
        { 
            condition: true,
            action: () => UIStore.showCreateChat(true),
            icon: <></>,
            text: 'create new chat'
        },
        { 
            condition: true,
            action: () => {UIStore.changeTheme(!UIStore.isDarkMode)},
            icon: <></>,
            text: 'night mode'
        }
    ];

    return (
        <div className={`menu-btn ${UIStore.modals.settingsMenu && 'close'}`} onClick={handleMenuToggle}>
            <div className="btn-line"></div>
            <div className="btn-line"></div>
            <div className="btn-line"></div>
            <CSSTransition in={UIStore.modals.settingsMenu} timeout={300} classNames="menu" unmountOnExit>
                <Menu 
                    connected={true} 
                    items={menuItems} 
                    position={{origin:'top left', x: 0, y: 0}} 
                    onClose={() => UIStore.resetMenus()} 
                    className='menu--settings'
                />
            </CSSTransition>
        </div>
    );
};

export default observer(MenuButton)