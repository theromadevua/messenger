import { observer } from "mobx-react";
import ChatItem from "../ChatItem";

const ChatList = observer(({ chats }) => {
    return chats.map(chat => (
        <ChatItem key={chat._id} with_user={chat.with_user} id={chat._id} userId={chat.with_user || null} name={chat.name} 
                last_message={chat.last_message} avatar={chat.avatar} type={chat.type}/>
    ));
});

export default ChatList