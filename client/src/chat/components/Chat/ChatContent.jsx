import { observer } from "mobx-react";
import Header from '../Header/Header';
import ChatBar from "../ChatBar/ChatBar";
import ChatInput from "../ChatInput/ChatInput";
import ChatStore from "../../../store/chat/ChatStore";
import { useEffect } from "react";

const ChatContent = observer(() => {
  
  useEffect(() => {
    const currentChat = ChatStore.state.currentChat;
    if (!currentChat) return;
    if (currentChat.with_user) {
      const anotherUserData = ChatStore.state.anotherUserData;
      if (!anotherUserData || anotherUserData._id === currentChat.with_user) {
        ChatStore.chatManager.getUser(currentChat.with_user);
      }
    }
  }, [ChatStore.state.currentChat]);

  if (!ChatStore.state.currentChat && !ChatStore.state.anotherUserData) {
    return null;
  }

  return (
    <div className="chat__content">
      <Header />
      <ChatBar />
      <ChatInput />
    </div>
  );
});

export default ChatContent;