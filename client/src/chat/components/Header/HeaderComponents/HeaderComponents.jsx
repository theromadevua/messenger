import { RESOURCE_URL } from "../../../../services/api";
import { memo } from "react";
import { useUserColor } from "../../../../hooks/useUserColor";

export const ChatInfo = memo(({membersCount, name, avatar, id}) => {
    const chatColor = useUserColor(id);

    return (
        <div className='header__info'>
            <div className='header__icon'>
                {renderContent(chatColor, avatar, name)}
            </div>
            <div className='header__chat-info'>
                <h2>{name}</h2>
                <p>{membersCount} members</p>
            </div>
        </div>
)});

export const UserInfo = memo(({name, status, avatar, id}) => {
    const userColor = useUserColor(id);

    return (
        <div className='header__info'>
            <div className='header__icon'>
                {renderContent(userColor, avatar, name)}
            </div>
            <div className='header__chat-info'>
                <h2>{name}</h2>
                <p style={{color: status == 'online' ? 'lightgreen' : ''}}>{status}</p>
            </div>
        </div>
)});

const renderContent = (userColor, avatar, name) => {
    if (avatar) {
        return <img src={`${RESOURCE_URL}/${avatar.url}?size=45`} alt={name} />;
    }
    
    return (
        <div 
            className="avatar-placeholder" 
            style={{ 
                backgroundColor: userColor,
            }}
        >
            {name[0].toUpperCase()}
        </div>
    );
};