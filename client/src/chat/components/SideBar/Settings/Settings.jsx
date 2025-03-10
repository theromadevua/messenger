import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { observer } from 'mobx-react';
import UIStore from '../../../../store/UIStore';
import ProfileForm from '../ProfileForm';
import SettingsButtons from '../SettingsButtons';
import AvatarUpload from '../AvatarUpload';
import useSettings from './hooks/useSettings';

const Settings = observer(() => {
  const {
    formData,
    setFormData,
    avatar,
    setAvatar,
    previewUrl,
    showConfirmWindow,
    setShowConfirmWindow,
    handleSubmit,
    handleClose
  } = useSettings();

  return (
    <CSSTransition
      in={UIStore.modals.settingsModal}
      timeout={300}
      classNames="settings"
      unmountOnExit
    >
      <div className="settings" onClick={handleClose}>
        <div className="settings__content" onClick={(e) => e.stopPropagation()}>
          <button
            className='settings__logout-button'
            onClick={() => setShowConfirmWindow(true)}
          >
            log out
          </button>

          <h3 className='settings__edit-profile'>Edit profile:</h3>

          <AvatarUpload
            previewUrl={previewUrl}
            setAvatar={setAvatar}
          />

          <ProfileForm
            formData={formData}
            setFormData={setFormData}
          />

          <SettingsButtons
            onSave={handleSubmit}
            onClose={handleClose}
            showLogoutConfirm={showConfirmWindow}
            setShowLogoutConfirm={setShowConfirmWindow}
          />
        </div>
      </div>
    </CSSTransition>
  );
});

export default Settings;
