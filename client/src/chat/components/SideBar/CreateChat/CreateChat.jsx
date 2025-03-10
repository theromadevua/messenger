import { useState } from "react";
import MainStore from "../../../../store/MainStore";
import { CSSTransition } from "react-transition-group";
import { observer } from "mobx-react";
import ChatStore from "../../../../store/chat/ChatStore";
import UIStore from "../../../../store/UIStore";

const CreateChat = () => {
    const [name, setName] = useState('')
    const [link, setlink] = useState('')

    return (
        <CSSTransition
            in={UIStore.modals.createChatWindow}
            timeout={300}
            classNames="settings"
            unmountOnExit
        >  
        <div className="create-chat">
            <div className="create-chat__content" onClick={e => e.stopPropagation()}>
                <h1 className="title">Create chat</h1>
                <div className="create-chat__inputs">
                    <input type="text" placeholder="name" value={name} onChange={e => setName(e.target.value)}/>
                    <input type="text" placeholder="link" value={link} onChange={e => setlink(e.target.value)}/>
                </div>
                <div className="create-chat__buttons">
                    <button className="create-chat__back-button" onClick={() => UIStore.showCreateChat(false)}>back to home</button>
                    <button className="create-chat__create-chat-button" onClick={() => {UIStore.showCreateChat(false); ChatStore.chatManager.createPublicChat({link, name})}}>create</button>
                </div>
            </div>
        </div>
        </CSSTransition>
    );
};

export default observer(CreateChat);