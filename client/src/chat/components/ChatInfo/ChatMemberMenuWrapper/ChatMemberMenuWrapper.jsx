import { observer } from "mobx-react";
import ChatStore from "../../../../store/chat/ChatStore";
import { CSSTransition } from "react-transition-group";
import { ChatMemberMenu } from "../ChatMemberMenu/ChatMemberMenu";
import UIStore from "../../../../store/UIStore";

const ChatMemberMenuWrapper = observer(() => (
    <CSSTransition
        in={UIStore.modals.chatMemberMenu}
        timeout={300}
        classNames="menu"
        unmountOnExit
    >
        <ChatMemberMenu member={ChatStore.state.selectedMember} position={{x: UIStore.coordinates.x, y: UIStore.coordinates.y}}/>
    </CSSTransition>
));

export default ChatMemberMenuWrapper