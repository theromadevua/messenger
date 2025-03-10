import { useCallback, useEffect, useRef, useState } from 'react';
import ChatStore from '../../../../../store/chat/ChatStore';

export const useChatScroll = (chatId) => {
    const scrollPositionsRef = useRef({});
    const chatBarRef = useRef(null);
    const timeoutRef = useRef(null);
    const isScrollingRef = useRef(false);
    const [prevMessages, setPrevMessages] = useState([]);

    const saveScrollPosition = useCallback(() => {
        if (chatBarRef.current) {
            const { scrollHeight, scrollTop } = chatBarRef.current;
            scrollPositionsRef.current[chatId] = {
                scrollHeight,
                scrollTop
            };
        }
    }, [chatId]);

    const restoreScrollPosition = useCallback(() => {
        if (chatBarRef.current && scrollPositionsRef.current[chatId]) {
            const { scrollHeight, scrollTop } = scrollPositionsRef.current[chatId];
            const newScrollTop = chatBarRef.current.scrollHeight - scrollHeight + scrollTop;
            chatBarRef.current.scrollTop = newScrollTop;
        }
    }, [chatId]);

    const scrollToBottom = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            if (chatBarRef.current) {
                chatBarRef.current.scrollTop = chatBarRef.current.scrollHeight;
            }
        }, 100);
    }, []);

    const handleHistoryScroll = useCallback(async () => {
        if (chatBarRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = chatBarRef.current;
            const isAtTop = scrollTop === 0;
            const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 1;

            if (isAtTop && !isAtBottom) {
                saveScrollPosition();
                await ChatStore.chatManager.loadChatMessages(chatId);
            }

            if (!isScrollingRef.current) {
                isScrollingRef.current = true;
                requestAnimationFrame(() => {
                    saveScrollPosition();
                    isScrollingRef.current = false;
                });
            }
        }
    }, [chatId, saveScrollPosition]);

    const handleMessagesUpdate = useCallback(() => {
        const currentMessages = ChatStore.state.currentChat?.messages || [];
        if (currentMessages.length > 0) {
            const messagesChanged = JSON.stringify(currentMessages.slice(1)) == JSON.stringify(prevMessages);
            const noSavedScrollPosition = !scrollPositionsRef.current[chatId];

            if (messagesChanged) {
                setPrevMessages(currentMessages);
                scrollToBottom();
            } else if (noSavedScrollPosition && currentMessages.length > 0) {
                setPrevMessages(currentMessages);
                scrollToBottom();
            } else {
                setPrevMessages(currentMessages);
                restoreScrollPosition();
            }
        }
    }, [chatId, prevMessages, restoreScrollPosition, scrollToBottom]);

    useEffect(() => {
        const chatBar = chatBarRef.current;
        if (chatBar) {
            chatBar.addEventListener('scroll', handleHistoryScroll);
        }

        return () => {
            if (chatBar) {
                chatBar.removeEventListener('scroll', handleHistoryScroll);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [handleHistoryScroll]);

    useEffect(() => {
        handleMessagesUpdate();
    }, [ChatStore.state.currentChat?.messages]);

    return {
        chatBarRef,
        messages: ChatStore.state.currentChat?.messages || []
    };
};