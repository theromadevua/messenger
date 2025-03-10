import { observer } from "mobx-react";
import ChatStore from "../../../../store/chat/ChatStore";

const ReplyToMessage = observer(({scrollToMessage}) => {
    return <div className='chat-input__reply-block' onClick={() => scrollToMessage(ChatStore.state.selectedMessage._id)}>
    <div className='chat-input__reply-info'>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" fill="currentColor"/>
        </svg>
        <div className="chat-input__reply-info-text">
            <h3>Reply to {ChatStore.state.selectedMessage.from_user.name}</h3>
            <p>{ChatStore.state.selectedMessage.text}</p>
        </div>
    </div>
    <svg onClick={(e) => {e.stopPropagation(); ChatStore.messageManager.setReplyToMessageId(false)}} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" fill="currentColor"/>
    </svg>
</div>
});

export default ReplyToMessage