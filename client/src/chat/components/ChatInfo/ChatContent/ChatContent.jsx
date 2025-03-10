import React from 'react';
import PublicChatContent from '../PublicChatContent';
import PrivateChatContent from '../PrivateChatContent';
import ChatStore from '../../../../store/chat/ChatStore';

const ChatContent = ({
    chatType,
    showEditButton,
    formData,
    onSubmit,
    onFormChange,
    previewUrl,
    onAvatarChange,
    canvasRef,
}) => {
    if (chatType === 'public') {
        return (
            <PublicChatContent
                showEditButton={showEditButton}
                formData={formData}
                onSubmit={onSubmit}
                onFormChange={onFormChange}
                previewUrl={previewUrl}
                onAvatarChange={onAvatarChange}
                canvasRef={canvasRef}
            />
        );
    }

    if (chatType === 'private' || ChatStore.state.anotherUserData) {
        return (
            <PrivateChatContent
                canvasRef={canvasRef}
                onFormChange={onFormChange}
                formData={formData}
                previewUrl={previewUrl}
            />
        );
    }
};

export default ChatContent;