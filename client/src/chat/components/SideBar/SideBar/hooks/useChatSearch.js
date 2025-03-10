import { useEffect } from 'react';
import ChatStore from '../../../../../store/chat/ChatStore';

const useChatSearch = (query) => {
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) {
                ChatStore.chatManager.searchChatsAndUsers(query);
            } else {
                ChatStore.chatManager.resetSearchedData();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);
};

export default useChatSearch;
