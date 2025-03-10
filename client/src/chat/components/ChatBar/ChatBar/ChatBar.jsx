import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { MediaWindow } from '../MediaWindow/MediaWindow';
import ChatWallpapers from '../ChatWallpapers/ChatWallpapers';
import ChatMessages from '../ChatMessages/ChatMessages';
import MessageMenu from '../MessageMenu/MessageMenu';
import { useChatScroll } from './hooks/useChatScroll';

const ChatBar = () => {
    const { id } = useParams();
    const {messages, chatBarRef} = useChatScroll(id);

    return (
        <div className="chat-bar" ref={chatBarRef}>
            <ChatWallpapers/>
            <div className='chat-bar__container'>
                <MessageMenu chatBarRef={chatBarRef}/>
                <MediaWindow/>
                <ChatMessages messages={messages}/>
            </div>
        </div>
    );
};

export default observer(ChatBar);


