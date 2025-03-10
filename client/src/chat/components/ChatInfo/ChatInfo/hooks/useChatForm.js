import { useState, useEffect } from 'react';
import ChatStore from '../../../../../store/chat/ChatStore';
import { RESOURCE_URL } from '../../../../../services/api';

export const useChatForm = (setPreviewUrl) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    link: '', 
    description: '', 
    _id: '' 
  });

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (ChatStore.state.currentChat?.type === 'public') {
      const { name, link, description, avatar, _id } = ChatStore.state.currentChat;
      setFormData({
        _id: _id || '',
        name: name || '',
        link: '@' + (link || ''),
        description: description || ''
      });
      avatar ? setPreviewUrl(`${RESOURCE_URL}/${avatar.url}`) : setPreviewUrl(null);
    } else if (ChatStore.state.anotherUserData) {
      const { name, description, avatar, _id } = ChatStore.state.anotherUserData;
      setFormData({
        _id: _id,
        name: name || '',
        description: description || ''
      });
      avatar ? setPreviewUrl(`${RESOURCE_URL}/${avatar.url}`) : setPreviewUrl(null);
    }
  }, [ChatStore.state.currentChat, ChatStore.state.anotherUserData, setPreviewUrl]);

  return { formData, handleFormChange };
};