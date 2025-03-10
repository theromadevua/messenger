import { observer } from "mobx-react";
import ChatStore from "../../../../store/chat/ChatStore";

const EditMessage = observer(({scrollToMessage, setText}) => {
    return <div className='chat-input__reply-block' onClick={() => {scrollToMessage(ChatStore.state.messageToEdit?._id)}}>
        <div className='chat-input__reply-info'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
        </svg>
        <div className="chat-input__reply-info-text">
            <h3>Edit message {ChatStore.state.messageToEdit?.from_user?.name}</h3>
            <p>{ChatStore.state.messageToEdit.text}</p>
        </div>
        </div>
        <svg onClick={() => {ChatStore.setMessageToEdit(null); setText('')}} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" fill="currentColor"/>
        </svg>
    </div>
});

export default EditMessage