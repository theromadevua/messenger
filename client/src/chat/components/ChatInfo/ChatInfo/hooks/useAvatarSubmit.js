import { useCallback } from 'react';
import ChatStore from '../../../../../store/chat/ChatStore';

export const useAvatarSubmit = (formData, avatar, setAvatar, setPreviewUrl) => {
  const handleSubmit = useCallback(async () => {
    const submitData = new FormData();
    
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'link') {
        submitData.append(key, value.replace('@', ''));
      } else {
        submitData.append(key, value);
      }
    });

    // Append avatar if exists
    if (avatar) {
      submitData.append(
        'avatar',
        new File([avatar], "image.jpg", { type: avatar.type })
      );
    }

    try {
      if (setAvatar) {
        setAvatar(null);
      }
      if (setPreviewUrl) {
        setPreviewUrl(null);
      }

      await ChatStore.chatManager.editChat(submitData, ChatStore.state.currentChat._id);
      
    
    } catch (error) {
      console.error('Failed to submit avatar:', error);
    }
  }, [formData, avatar, setAvatar, setPreviewUrl]);

  return { handleSubmit };
};