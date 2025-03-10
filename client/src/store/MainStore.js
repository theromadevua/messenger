import { makeAutoObservable } from "mobx";
import UIStore from "./UIStore";

class MainStore {
    isShowSideBar = false
    isShowChatInfo = true
    isMobile = true
    isActiveChatinfo = false
    isActiveChatBar = false
    isActiveSideBar = true
    audioURL = '';
    audioBlob = null;

    constructor(){
        makeAutoObservable(this)
    }
    
    setAudioURL(url) {
        this.audioURL = url;
    }
    
    setAudioBlob(blob) {
       this.audioBlob = blob;
    }

    // mobile navigation

    setIsMobile(value){
        this.isMobile = value
        UIStore.resetMenus()
    }

    setIsActiveSideBar(){
        this.resetCurrentSpot()
        setTimeout(() => {
            this.isActiveSideBar = true
        }, 100);
    }

    setIsActiveChatInfo(value){
        this.resetCurrentSpot()
        setTimeout(() => {
            this.isActiveChatinfo = value !== undefined ? value : true
        }, 100);
    }

    setIsActiveChatBar(value){
        this.resetCurrentSpot()
        setTimeout(() => {
            this.isActiveChatBar = value !== undefined ? value : true
        }, 100);
    }

    resetCurrentSpot(){
        this.isActiveChatinfo = false
        this.isActiveSideBar = false
        this.isActiveChatBar = false
    } 
}

export default new MainStore()