import { makeAutoObservable } from "mobx";
import MessageManager from "./MessageManager";
import ChatManager from "./ChatManager";
import MemberManager from "./MemberManager";

class ChatStore {
    state = {
        chats: [],
        currentChat: null,
        selectedMessage: null,
        messageToEdit: null,
        anotherUserData: null,
        selectedMember: null,
        searchedData: [],
        messageMedia: [],
        currentMedia: false,
        replyToMessageId: null,
        isOwner: false,
        isAdmin: false,
        isMember: false,
        isLoadingChats: false,
        isLoadingHistory: false,
    }
    pagination = {
        limit: 20,
        chatPages: {},
        skipPages: {}
    }

    constructor() {
        makeAutoObservable(this)
        this.messageManager = new MessageManager(this);
        this.chatManager = new ChatManager(this)
        this.memberManager = new MemberManager(this)
    }

    get userHasRights() {
        return (this.state.isAdmin || this.state.isOwner) && !this.state.anotherUserData;
    }

    setState(key, value) {
        this.state[key] = value;
    }

    handleError(error, customMessage = 'An error occurred') {
        console.error(error);
        alert(`${customMessage}: ${error.response?.data?.message || error.message}`);
    }

    async resetChat() {
        this.setState('currentChat', null);
        this.setState('anotherUserData', null);
        this.setState('isMember', null);
    }

   
    setCurrentMedia(media) {
        this.setState('currentMedia', media);
    }

    unselectMessage() {
        this.setState('selectedMessage', null);
    }

    setMessageToEdit(message) {
        this.setState('messageToEdit', message);
    }

    async selectMessage(message) {
        this.setState('selectedMessage', message);
    }

    selectMember(member) {
        this.setState('selectedMember', member);
    }
}

export default new ChatStore();