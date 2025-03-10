import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatStore from '../../../../../store/chat/ChatStore';
import MainStore from '../../../../../store/MainStore';
import UIStore from '../../../../../store/UIStore';

const useHeaderLogic = () => {
    const [showConfirmWindow, setShowConfirmWindow] = useState(false);
    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        MainStore.setIsActiveSideBar();
        navigate('/');
    }, [navigate]);

    useEffect(() => {
        window.onpopstate = handleBack;
        return () => { window.onpopstate = null; };
    }, [handleBack]);

    const handleLeaveChat = () => {
        ChatStore.chatManager.leaveChat(ChatStore.state?.currentChat?._id);
        navigate('/');
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
        if (MainStore.isMobile) {
            const path = ChatStore.state.currentChat
                ? '/chatInfo/' + ChatStore.state.currentChat?._id
                : '/userInfo/' + ChatStore.state.anotherUserData?._id;
            navigate(path);
        } else {
            UIStore.showChatMenu(!UIStore.modals.chatMenu);
        }
    };

    return {
        showConfirmWindow,
        setShowConfirmWindow,
        handleBack,
        handleLeaveChat,
        handleMenuClick,
    };
};

export default useHeaderLogic;