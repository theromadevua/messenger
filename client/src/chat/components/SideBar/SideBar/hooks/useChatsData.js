import { useMemo } from 'react';
import ChatStore from '../../../../../store/chat/ChatStore';

const useChatsData = () => {
    const chatsData = useMemo(() => ChatStore.state.chats, [ChatStore.state.chats]);
    const searchedData = useMemo(() => ChatStore.state.searchedData, [ChatStore.state.searchedData]);

    return { chatsData, searchedData };
};

export default useChatsData;
