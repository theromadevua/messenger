import { useCallback } from 'react';
import { observer } from 'mobx-react';
import ChatStore from '../../../../store/chat/ChatStore';
import ChatMember from '../ChatMember/ChatMember';
import ChatMemberMenuWrapper from '../ChatMemberMenuWrapper/ChatMemberMenuWrapper';
import AuthStore from '../../../../store/AuthStore';
import UIStore from '../../../../store/UIStore';

const ChatMembers = observer(() => {
    const handleContextMenu = useCallback((e, member) => {
        e.preventDefault();
        e.stopPropagation();
        if(!ChatStore.userHasRights) {UIStore.resetMenus(); return}
        if(AuthStore.user._id == member.user._id) {UIStore.resetMenus(); return}
        ChatStore.selectMember(member);
        UIStore.setIsShowChatMemberMenu(e.clientX, e.clientY);
    }, []);

    return (
        <>
            <div className='chat-info__chat-list-button'>Members</div>
            <ChatMemberMenuWrapper/>
            <ChatMembersList handleContextMenu={handleContextMenu}/>
        </>
    );
});

const ChatMembersList = observer(({handleContextMenu}) => {
    return <div>
        {ChatStore.state.currentChat.members.map(member => (
            <ChatMember  
                key={member.user._id} 
                member={member} 
                onContextMenu={handleContextMenu}
            />
        ))}
    </div>
})

export default ChatMembers