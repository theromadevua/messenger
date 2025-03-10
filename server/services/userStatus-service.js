class UserStatusService {
    constructor() {
        this.onlineUsers = new Map(); // { userId: socketId }
    }

    setUserOnline(userId, socketId) {
        this.onlineUsers.set(userId.toString(), socketId);
    }

    setUserOffline(userId) {
        this.onlineUsers.delete(userId.toString());
    }

    isUserOnline(userId) {
        return this.onlineUsers.has(userId.toString());
    }
}

export default new UserStatusService();