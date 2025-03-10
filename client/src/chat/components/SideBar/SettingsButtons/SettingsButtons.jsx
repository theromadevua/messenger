import AuthStore from "../../../../store/AuthStore";
import ConfirmWindow from "../../../../shared/components/ConfirmWindow";

const SettingsButtons = ({ onSave, onClose, showLogoutConfirm, setShowLogoutConfirm }) => (
    <div className='settings__buttons-menu'>
      <button className='settings__close-button' onClick={onClose}>
        back
      </button>
      <button onClick={onSave} className='settings__submit-button'>
        Save Changes
      </button>
      {showLogoutConfirm && (
        <ConfirmWindow 
          func={() => { AuthStore.logout(); }} 
          isShow={setShowLogoutConfirm}
        >
          <p>are you sure you want to log out?</p>
        </ConfirmWindow>
      )}
    </div>
  );

  export default SettingsButtons