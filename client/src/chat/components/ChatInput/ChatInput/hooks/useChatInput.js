import { useState, useEffect, useRef, useCallback } from 'react';
import ChatStore from '../../../../../store/chat/ChatStore';
import mime from 'mime';
import * as uuid from 'uuid';

const base64ToArrayBuffer = base64 => {
    const binaryString = atob(base64.split(',')[1]);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) uint8Array[i] = binaryString.charCodeAt(i);
    return uint8Array.buffer;
};

export const useChatInput = () => {
    const [text, setText] = useState('');
    const imageInputRef = useRef();

    const handleSubmit = useCallback(async () => {
        const files = ChatStore.state.messageMedia;
        if (!text.trim() && !files?.length) return;

        try {
            if (ChatStore.state.currentChat) {
                if (ChatStore.state.messageToEdit) {
                    await ChatStore.messageManager.editChatMessage({
                        text,
                        message_id: ChatStore.state.messageToEdit._id,
                        id: ChatStore.state.currentChat._id,
                        chatType: ChatStore.state.currentChat.chatType,
                    });
                    ChatStore.setMessageToEdit(null);
                } else {
                    await handleCreateMessage(files);
                }
            } else {
                await ChatStore.chatManager.createPrivateChat(text);
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }

        setText('');
    }, [text]);

    const handleCreateMessage = async (files) => {
        if (files?.length) {
            const fileDataArray = await Promise.all(
                Array.from(files).map(file => {
                    const mimeType = file.match(/^data:(.+);base64,/)[1];
                    const extension = mime.getExtension(mimeType);
                    return {
                        name: `${uuid.v4()}.${extension}`,
                        data: base64ToArrayBuffer(file),
                    };
                })
            );
            await ChatStore.messageManager.createChatMessage({
                text,
                id: ChatStore.state.currentChat._id,
                chatType: ChatStore.state.currentChat.chatType,
                files: fileDataArray,
            });
        } else {
            await ChatStore.messageManager.createChatMessage({
                text,
                id: ChatStore.state.currentChat._id,
                chatType: ChatStore.state.currentChat.chatType,
            });
        }
    };

    useEffect(() => {
        if (ChatStore.state.messageToEdit) {
            setText(ChatStore.state.messageToEdit.text);
        }
    }, [ChatStore.state.messageToEdit]);

    const scrollToMessage = useCallback((messageId) => {
        const element = document.getElementById(messageId);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    return { text, setText, imageInputRef, handleSubmit, scrollToMessage };
};
