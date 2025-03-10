
import React from 'react';
import VoiceRecorder from '../VoiceRecorder/VoiceRecorder';
import ChatStore from '../../../../store/chat/ChatStore';
import { observer } from 'mobx-react';
import { FilePlus, SendHorizonal } from 'lucide-react';

const InputForm = observer(({handleSubmit, text, setText, imageInputRef}) => {
    
    const handleFileSelect = e => {
        e.stopPropagation();
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => ChatStore.messageManager.setMessageMedia(reader.result);
            reader.readAsDataURL(e.target.files[0]);
        }
        e.target.value = null;
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

  return (
       <form className={(ChatStore.state.replyToMessageId || ChatStore.state.messageToEdit) ? 'chat-input__container chat-input__container--with-reply-block' : 'chat-input__container'}>
                {ChatStore.state.isMember && !ChatStore.state.messageToEdit &&(
                    <div className='chat-input__buttons'>
                        <VoiceRecorder/>
                        <input type="file" accept="image/*" ref={imageInputRef} onClick={e => e.stopPropagation()} onChange={handleFileSelect} style={{display: 'none'}}/>
                        <div onClick={e => {e.stopPropagation(); imageInputRef.current.click();}} className='chat-input-button'>
                            <FilePlus/>
                        </div>
                    </div>
                )}
                <input type="text" value={text} placeholder='Write a message' onChange={e => setText(e.target.value)} onKeyDown={handleKeyPress}/>
                <div onClick={handleSubmit} className='send-button'>
                    <SendHorizonal />
                </div>
        </form>
  );
});

export default InputForm;