import { makeAutoObservable } from "mobx";
import api from "../../services/api";

class MemberManager {

    constructor(rootStore){
        makeAutoObservable(this)
        this.rootStore = rootStore
    }

    async updateMemberRole(member, action) {
        try {
            const response = await api.post(`/${action}/${member._id}`);
            this.chatManager.updateChat(member.chat, chat => ({
                ...chat,
                members: chat.members.map(chatMember =>
                    chatMember._id === member._id
                        ? { ...chatMember, role: response.data.role }
                        : chatMember
                )
            }));
        } catch (error) {
            this.rootStore.handleError(error, `Failed to ${action} member`);
        }
    }

    async dismissAdmin(member) {
        await this.updateMemberRole(member, 'dismissAdmin');
    }

    async assignAdmin(member) {
        await this.updateMemberRole(member, 'assignAdmin');
    }

    async addUser(anotherUserId, chat_id) {
        try {
            const response = await api.post(`addUser/${chat_id}`, { anotherUserId });
            
            this.rootStore.chatManager.updateChat(chat_id, chat => ({
                ...chat,
                messages: [response.data.newMessage, ...chat.messages],
                members: [...chat.members, response.data.member]
            }));
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to add user');
        }
    }
}

export default MemberManager