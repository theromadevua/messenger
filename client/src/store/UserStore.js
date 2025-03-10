import { makeAutoObservable } from "mobx"
import api from "../services/api";

class UserStore {
    searchedUsers = [];
    users = new Map()

    constructor(){
        makeAutoObservable(this)
    }

    resetSearchedUsers() {
        this.searchedUsers = [];
    }

    async searchUsers(query) {
        try {
            const response = await api.get('/searchUsers', { params: { query } });
            this.searchedUsers = response.data;
        } catch (error) {
            this.setError('User search failed: ' + (error.response?.data?.message || error.message));
        }
    }

    async setUsers(users) {
        
        users.forEach(user => {
            this.users.set(user._id, {
                name: user.name,
                avatar: user.avatar,
                online: user.online ?? false,
            });
        });
    }

    setUserStatus(userId, status) {
        if (this.users.has(userId)) {
            this.users.get(userId).online = status;
        }
    }

    getUser(userId) {
        return this.users.get(userId);
    }
}

export default new UserStore()