import { makeAutoObservable } from "mobx"

class UIStore {
    modals = {
        chatMemberMenu: false,
        contextMenu: false,
        settingsMenu: false,
        settingsModal: false,
        chatMenu: false,
        wallpaperWindow: false,
        addUserWindow: false,
        createChatWindow: false
    };

    coordinates = {
        x: null,
        y: null
    };

    isDarkMode = true;

    constructor() {
        makeAutoObservable(this);
        document.body.classList.add('dark')
    }

    hasOpenModals() {
        return Object.values(this.modals).some((isOpen) => isOpen);
    }

    async waitForAllModalsToClose(delay = 300) {
        if (this.hasOpenModals()) {
            this.resetMenus()
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    
    checkValue(value){
        if(value == undefined) return true
        if(value) return true
        return false
    }

    resetMenus() {
        this.modals = {
            chatMemberMenu: false,
            contextMenu: false,
            settingsMenu: false,
            settingsModal: false,
            chatMenu: false,
            wallpaperWindow: false,
            addUserWindow: false,
            createChatWindow: false
        };
    }

    changeTheme(value) {
        if(value){
            document.body.classList.add('dark')
            this.isDarkMode = true
        }else{
            document.body.classList.remove('dark')
            this.isDarkMode = false
        }
    }

    openModal(modalId, data = null) {
        this.modals[modalId] = data;
    }

    closeModal(modalId) {
        this.modals[modalId] = false;
    }

    get isAnyModalOpen() {
        return Object.values(this.modals).some(Boolean);
    }

    async setIsShowChatMemberMenu(x, y, delay = 300) {
        await this.waitForAllModalsToClose();
        this.modals.chatMemberMenu = true;
        this.coordinates.x = x;
        this.coordinates.y = y;
    }

    async showContextMenu(x, y) {
        await this.waitForAllModalsToClose();
        this.coordinates.x = x;
        this.coordinates.y = y;
        setTimeout(() => {
            this.modals.contextMenu = true;
        }, 10);
    }

    async showSettingsMenu(value){
        await this.waitForAllModalsToClose();
        if(!this.checkValue(value)) return
        this.modals.settingsMenu = true;
    }

    async showSettingsModal(value){
        await this.waitForAllModalsToClose();
        if(!this.checkValue(value)) return
        this.modals.settingsModal = true;
    }

    async showChatMenu(value){
        await this.waitForAllModalsToClose();
        if(!this.checkValue(value)) return
        this.modals.chatMenu = true;
    }

    async showWallpaperWindow(value){
        await this.waitForAllModalsToClose();
        if(!this.checkValue(value)) return
        this.modals.wallpaperWindow = true;
    }
    
    async setAddUserWindow(value){
        await this.waitForAllModalsToClose();
        if(!this.checkValue(value)) return
        this.modals.addUserWindow = true;
    }

    async showCreateChat(value){
        await this.waitForAllModalsToClose();
        if(!this.checkValue(value)) return
        this.modals.createChatWindow = true;
    }
}


export default new UIStore()