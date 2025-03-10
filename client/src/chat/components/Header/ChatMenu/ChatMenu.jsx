import { observer } from "mobx-react";
import ChatStore from "../../../../store/chat/ChatStore";
import MainStore from "../../../../store/MainStore";
import UIStore from "../../../../store/UIStore";
import Menu from "../../../../shared/components/Menu";

const ChatMenu = observer(({setShowConfirmWindow}) => {
    const menuItems = [
        {
            condition: (ChatStore.userHasRights || ChatStore.state?.currentChat?.type === 'private'), 
            icon: <></>,
            action: () => {UIStore.showWallpaperWindow(true); if(MainStore.isMobile) MainStore.setIsActiveChatInfo(false)},
            text: 'change wallpaper'
        },
        {
            condition: ChatStore.state?.currentChat?.type === 'public', 
            icon: <></>,
            action: () => {setShowConfirmWindow(true)},
            text: 'leave chat'
        },
        {
            condition: ChatStore.state.isOwner || ChatStore.state?.currentChat?.type === 'private', 
            icon: <></>,
            action: () => {ChatStore.chatManager.deleteChat(ChatStore.state?.currentChat?._id)},
            text: 'delete chat'
        },
    ]
    return (
        <Menu 
            className="menu--header" 
            position={{x: 0, y: 0, origin: 'top right'}} 
            items={menuItems} 
            connected={true}
            onClose={() => UIStore.resetMenus()}
        />
    );
});

export default ChatMenu