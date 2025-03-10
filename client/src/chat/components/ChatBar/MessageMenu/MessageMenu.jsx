import { observer } from "mobx-react";
import ChatStore from "../../../../store/chat/ChatStore";
import AuthStore from "../../../../store/AuthStore";
import Menu from "../../../../shared/components/Menu";
import { useCopyToClipboard } from "../../../../hooks/useCopyToClipboard";
import UIStore from "../../../../store/UIStore";
import { CSSTransition } from "react-transition-group";
import {Copy, Edit, Reply, Trash, X} from 'lucide-react'

const MessageMenu = observer(({ chatBarRef }) => {
    const copyToClipboard = useCopyToClipboard();

    const handleCopy = (text) => {
      copyToClipboard(text);
    };
  
    const menuItems = [
        {
            condition: true,
            icon: <Reply/>,
            text: 'reply on',
            action: () => ChatStore.messageManager.setReplyToMessageId(ChatStore.state.selectedMessage?._id)
        },
        {
            condition: (ChatStore.state.selectedMessage?.from_user._id === AuthStore.user._id),
            icon: <Edit/>,
            text: 'edit message',
            action: () => ChatStore.setMessageToEdit(ChatStore.state.selectedMessage)
        },
        {
            condition: true,
            icon: <Copy/>,
            text: 'copy text',
            action: () => handleCopy(ChatStore.state.selectedMessage.text)
        },
        {
            condition: (ChatStore.state.selectedMessage?.from_user._id === AuthStore.user._id) || 
                    (ChatStore.state.isAdmin || ChatStore.state.isOwner),
            icon: <Trash/>,
            text: `delete message`,
            action: () => ChatStore.messageManager.deleteChatMessage()
        }
    ];
  
    return (
        <CSSTransition
            in={UIStore.modals.contextMenu}
            timeout={300}
            classNames="menu"
            unmountOnExit
        >
            <Menu
                items={menuItems}
                position={{ 
                x: UIStore.coordinates.x, 
                y: UIStore.coordinates.y,
                origin: 'top left'
                }}
                reference={chatBarRef}
                className="message-menu"
            />
        </CSSTransition>
    );
  });

export default MessageMenu