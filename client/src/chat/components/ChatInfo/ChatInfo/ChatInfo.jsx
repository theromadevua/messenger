import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../../../../store/MainStore';
import ChatStore from '../../../../store/chat/ChatStore';
import MobileNavigation from '../../../../shared/components/MobileNavigation';
import { useHandleImageCrop } from '../../../../hooks/useHandleImageCrop';
import ConfirmLeaveChat from '../../../../shared/components/ConfirmLeaveChat';
import ChatContent from '../ChatContent/ChatContent';
import { useChatForm } from './hooks/useChatForm';
import { useAvatarSubmit } from './hooks/useAvatarSubmit';
import { useChatActions } from './hooks/useChatActions';

const ChatInfo = observer(() => {
  const canvasRef = useRef(null);

  const { 
    avatar, 
    previewUrl, 
    handleImageCrop, 
    setPreviewUrl,
    setAvatar
  } = useHandleImageCrop(canvasRef);
  
  const { formData, handleFormChange } = useChatForm(setPreviewUrl);
  const { handleSubmit } = useAvatarSubmit(formData, avatar, setAvatar, setPreviewUrl);
  
  const { 
    showConfirmWindow, 
    setShowConfirmWindow, 
    handleLeaveChat, 
    showEditButton 
  } = useChatActions(formData, avatar);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      handleImageCrop(e.target.files[0]);
    }
  };

  return (
    <div className='chat-info'>
      {showConfirmWindow && (
        <ConfirmLeaveChat 
          isShow={setShowConfirmWindow} 
          onConfirm={handleLeaveChat} 
        />
      )}
      {MainStore.isMobile && (
        <MobileNavigation 
          setShowConfirmWindow={setShowConfirmWindow} 
        />
      )}
      <ChatContent
        chatType={ChatStore.state.currentChat?.type}
        showEditButton={showEditButton}
        formData={formData}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
        previewUrl={previewUrl}
        onAvatarChange={handleAvatarChange}
        canvasRef={canvasRef}
      />
    </div>
  );
});

export default ChatInfo;