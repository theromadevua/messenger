import { observer } from 'mobx-react';
import ChatStore from '../../../../store/chat/ChatStore';
import SendMediaWindow from '../SendMediaWindow';
import InputForm from '../InputForm/InputForm';
import EditMessage from '../EditMessage/EditMessage';
import ReplyToMessage from '../ReplyToMessage/ReplyToMessage';
import { useChatInput } from './hooks/useChatInput';

const ChatInput = () => {
    const { text, setText, imageInputRef, handleSubmit, scrollToMessage } = useChatInput();

    if (!ChatStore.state.isMember && ChatStore.state.currentChat?._id) {
        return (
            <div className='chat-input' onClick={() => ChatStore.chatManager.joinChat(ChatStore.state.currentChat._id)}>
                <form className='chat-input__container chat-input__container_join'><p>Join Chat</p></form>
            </div>
        );
    }

    return (
        <div className='chat-input'>
            <SendMediaWindow addImage={() => imageInputRef.current.click()} setText={setText} text={text} handleSubmit={handleSubmit}/>
            {ChatStore.state.replyToMessageId && <ReplyToMessage scrollToMessage={scrollToMessage} /> }
            {(ChatStore.state.messageToEdit?.from_user) && <EditMessage setText={setText} scrollToMessage={scrollToMessage} />}
            <InputForm handleSubmit={handleSubmit} text={text} setText={setText} imageInputRef={imageInputRef}/>
        </div>
    );
};

export default observer(ChatInput)