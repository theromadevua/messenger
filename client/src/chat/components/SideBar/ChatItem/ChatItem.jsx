import { useNavigate } from 'react-router-dom';
import { RESOURCE_URL } from '../../../../services/api';
import { memo } from 'react';
import { useUserColor } from '../../../../hooks/useUserColor';
import UserStore from '../../../../store/UserStore';
import { observer } from 'mobx-react';

const MessageContent = memo(({last_message}) => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {last_message.from_user ? last_message.from_user.name : ''}: 
            {last_message.type == 'combined' && <div style={{display: 'flex', alignItems: 'center'}}>
                {last_message.media.length && <img style={{marginLeft: 5, width: 23, height: 23, borderRadius: 5, objectFit: 'cover'}} src={`${RESOURCE_URL}/${last_message.media[0]?.url}`}/>}
                <p style={{marginLeft: 5}}>{last_message.text}</p>
            </div>}
            {last_message.type == 'text' && <div>
                <p style={{marginLeft: 5}}>{last_message.text}</p>
            </div>}
            {last_message.type == 'system' && ' system message'}
        </div>
    )
})

const ChatItem = observer(({id,last_message, name, avatar, link, type, userId, with_user}) => {
    const navigate = useNavigate()
    const color = useUserColor(userId || id);
    const user = with_user ? UserStore.getUser(with_user) : null;
    return (
        <div className='chat-item' onClick={() => {id ? navigate(`/chat/${id}`) : navigate(`/user/${userId}`)}}>
            <div className='chat-item__icon'>
            {renderContent(color, avatar, name)}
            </div> 
            <div className='chat-item__info'>
                <h2>{name} {user && <div className='status' style={{background: user.online ? 'lightgreen' : ''}}></div>}</h2>
                {last_message && <MessageContent last_message={last_message}/>}
               {link && <p>{link}</p>}
            </div>
        </div>
    );
});

const renderContent = (userColor, avatar, name, user) => {
    if (avatar) {
        return <img src={`${RESOURCE_URL}/${avatar?.url}?size=45`} alt=''/>
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

export default ChatItem;