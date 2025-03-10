import { observer } from "mobx-react";
import MainStore from "../../../../store/MainStore";
import ChatStore from "../../../../store/chat/ChatStore";
import UIStore from "../../../../store/UIStore";
import AnimatedModal from "../../../../shared/components/AnimatedModal";
import { useSearchUsers } from "./hooks/useSearchUsers";
import { useUserSelection } from "./hooks/useUserSelection";
import { RESOURCE_URL } from "../../../../services/api";
import { getUserColor } from "../../../../utils/colorUtils";
import { useState } from "react";

const UserAvatar = observer(({ user, userColor }) => {
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  if (hasError || !user?.avatar?.url) {
    return (
      <div className="add-user__avatar-placeholder" style={{ backgroundColor: userColor }}>
        <h2>{user.name[0]}</h2>
      </div>
    );
  }

  return (
    <img
      src={`${RESOURCE_URL}/${user.avatar.url}`}
      alt="User avatar"
      onError={handleImageError}
    />
  );
});

const AddUser = () => {
    const { searchTerm, setSearchTerm, users, isLoading } = useSearchUsers();
    const { selectedUser, toggleUserSelection, isUserMember } = useUserSelection(users, ChatStore.state.currentChat.members);

    const closeAddUser = () => {
        MainStore.setAddUserActive(false);
    };

    return (
        <AnimatedModal isOpen={UIStore.modals.addUserWindow} onClose={() => UIStore.resetMenus()} contentClassName="add-user">
          <div className="add-user__content" onClick={(e) => e.stopPropagation()}>
              <button className="add-user__close-button" onClick={closeAddUser}>{`<`} back to home</button>
              <h2>Search users to add</h2>
              <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="add-user__users-container">
                  {isLoading && <p>Loading...</p>}
                  {users.map((user) => {
                    const userColor = getUserColor(user._id);
                    const isMember = isUserMember(user);
                    const isSelected = selectedUser === user._id;

                    return (
                      <div 
                          key={user._id}
                          className={`add-user__user ${isSelected && 'selected'} ${isMember && 'member-user'}`} 
                          onClick={() => !isMember && toggleUserSelection(user)}
                      >
                          <div className="add-user__user-avatar">
                              <UserAvatar user={user} userColor={userColor} />
                              {isMember && <p>already</p>}
                              {isSelected && <p>add</p>}
                          </div>
                          <div className="add-user__user-info">
                              <h3>{user.name}</h3>
                              <p>@{user.username}</p>
                          </div>
                      </div>
                  )})}
              </div>
              
              <button 
                  className="add-user__add-button" 
                  onClick={() => {
                      ChatStore.memberManager.addUser(selectedUser, ChatStore.state.currentChat._id);
                      MainStore.setAddUserActive(false);
                      UIStore.resetMenus();
                  }}
                  disabled={!selectedUser}
              >
                  Add user
              </button>
          </div>
        </AnimatedModal>
    );
};

export default observer(AddUser);