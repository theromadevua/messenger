import { useState, useEffect, useCallback } from 'react';
import AuthStore from '../../../../../store/AuthStore';
import UIStore from '../../../../../store/UIStore';
import { RESOURCE_URL } from '../../../../../services/api';

const useSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    description: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showConfirmWindow, setShowConfirmWindow] = useState(false);

  useEffect(() => {
    if (AuthStore.user) {
      setFormData({
        name: AuthStore.user.name || '',
        username: AuthStore.user.username || '',
        description: AuthStore.user.description || ''
      });
      if (AuthStore.user.avatar) {
        setPreviewUrl(`${RESOURCE_URL}/${AuthStore.user.avatar?.url}`);
      }
    }
  }, [AuthStore.user]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    if (avatar) {
      submitData.append('avatar', new File([avatar], "image.jpg", {
        type: avatar.type
      }));
    }

    AuthStore.changeProfile(submitData);
    UIStore.resetMenus();
  }, [formData, avatar]);

  const handleClose = useCallback(() => {
    UIStore.resetMenus();
  }, []);

  return {
    formData,
    setFormData,
    avatar,
    setAvatar,
    previewUrl,
    showConfirmWindow,
    setShowConfirmWindow,
    handleSubmit,
    handleClose
  };
};

export default useSettings;
