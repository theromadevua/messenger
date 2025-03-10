import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatStore from '../../../../../store/chat/ChatStore';

export const useChatActions = (formData, avatar) => {
  const [showConfirmWindow, setShowConfirmWindow] = useState(false);
  const navigate = useNavigate();

  const handleLeaveChat = useCallback(() => {
    ChatStore.leaveChat(ChatStore.state?.currentChat?._id);
    navigate('/');
  }, [navigate]);

  const showEditButton = useMemo(() => {
    if (!ChatStore.state.currentChat) return false;
    return (
      Object.entries(formData).some(([key, value]) =>
        ChatStore.state.currentChat[key] !== value?.replace('@', '')
      ) || avatar
    ) && (ChatStore.state.isAdmin || ChatStore.state.isOwner);
  }, [formData, avatar, ChatStore.state.currentChat, ChatStore.state.isAdmin, ChatStore.state.isOwner]);

  return { showConfirmWindow, setShowConfirmWindow, handleLeaveChat, showEditButton };
};