import { useRef, useState } from "react";
import ChatStore from "../../../../../store/chat/ChatStore";
import UIStore from "../../../../../store/UIStore";

const useWallpaperManager = (currentChat, isBlurred, blackout, setIsBlurred, setBlackout) => {
  const [localImage, setLocalImage] = useState(null);
  const [localFile, setLocalFile] = useState(null);  
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setLocalImage(URL.createObjectURL(file));
      setLocalFile(file);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("chatId", currentChat._id);
    formData.append("isBlurred", isBlurred);
    formData.append("blackout", blackout);
    if (localFile) formData.append("wallpaper", localFile);

    ChatStore.chatManager.setChatWallpaper(formData);
    handleClose();
  };

  const handleClose = () => {
    UIStore.showWallpaperWindow(false);
    setLocalImage(null);
    setLocalFile(null);
  };

  const resetWallpapers = () => {
    ChatStore.chatManager.setChatWallpaper(null);
    handleClose();
  };

  return { localImage, fileInputRef, handleFileChange, handleSave, handleClose, resetWallpapers };
};

export default useWallpaperManager;