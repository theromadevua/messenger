import { useState, useEffect } from "react";
import ChatStore from "../../../../../store/chat/ChatStore";
import MainStore from "../../../../../store/MainStore";

const useMediaDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  let MAX_WIDTH = 700;
  let MAX_HEIGHT = 500;

  if (MainStore.isMobile) MAX_WIDTH = 400;

  const imageUrl = ChatStore.state.currentMedia
    ? `${ChatStore.state.currentMedia?.url}?quality=90&originalSize=true`
    : "";

  useEffect(() => {
    if (!ChatStore.state.currentMedia) return;

    const img = new Image();
    img.src = imageUrl;

    const { width, height } = ChatStore.state.currentMedia;

    if (width && height) {
      let scaledWidth = width;
      let scaledHeight = height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const widthRatio = MAX_WIDTH / width;
        const heightRatio = MAX_HEIGHT / height;
        const scale = Math.min(widthRatio, heightRatio);

        scaledWidth = Math.round(width * scale);
        scaledHeight = Math.round(height * scale);
      }

      setDimensions({ width: scaledWidth, height: scaledHeight });
      setIsOpened(true);
    }

    img.onload = () => setIsLoaded(true);
    img.onerror = () => console.error(imageUrl, "Error when image loading");
  }, [imageUrl]);

  const handleClose = () => {
    setIsOpened(false);
    setTimeout(() => {
      ChatStore.setCurrentMedia(null);
      setIsLoaded(false);
    }, 300);
  };

  return { dimensions, isLoaded, isOpened, handleClose, imageUrl };
};

export default useMediaDimensions;
