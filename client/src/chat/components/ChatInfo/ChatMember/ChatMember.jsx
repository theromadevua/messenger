import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { RESOURCE_URL } from "../../../../services/api";
import { useUserColor } from "../../../../hooks/useUserColor";
import UserStore from "../../../../store/UserStore";
import { observer } from "mobx-react";

const ChatMember = observer(({ member, onContextMenu }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate(`/user/${member.user._id}`);
    const color = useUserColor(member.user._id);
    const user = UserStore.getUser(member.user._id);
    return (
        <div 
            className="chat-info__chat-member" 
            onClick={handleClick}
            onContextMenu={(e) => onContextMenu(e, member)}
        >
            <div className="chat-info__chat-member-avatar">
                {!member.user.avatar?.url ? <div style={{backgroundColor: color}} className="chat-info__chat-member-avatar-placeholder">
                    {member.user.name[0].toUpperCase()}
                </div> : <img src={`${RESOURCE_URL}/${member.user.avatar?.url}?size=45`} alt='' />}
            </div>
            <div className="chat-info__chat-member-info">
                <h3>{member.user.name} <div className="status" style={{background: user?.online ? 'lightgreen' : ''}}></div></h3>
                <p>{member.role}</p>
            </div>
        </div>
    );
});

export default ChatMember