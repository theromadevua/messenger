import { useMemo } from 'react';
import ChatStore from '../store/chat/ChatStore';

export const useFindChatDataManager = (isPrivateChat = true, chatId) => {
    const chatData = useMemo(() => {
        const currentChat = ChatStore.state.chats.find((chat) => chat._id === chatId);
        const anotherUserData = ChatStore.state.anotherUserData;
        
        if (isPrivateChat) {
            return {
                id: anotherUserData?._id,
                name: anotherUserData?.name,
                avatar: anotherUserData?.avatar,
                displayName: anotherUserData?.name?.[0]?.toUpperCase(),
            };
        }

        return {
            id: currentChat?._id,
            name: currentChat?.name,
            avatar: currentChat?.avatar,
            displayName: currentChat?.name,
        };
    }, [
        isPrivateChat,
        chatId
    ]);

    return {
        chatData,
        hasRights: ChatStore.userHasRights,
    };
};