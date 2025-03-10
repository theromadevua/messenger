import { useEffect, useState } from "react";
import { RESOURCE_URL } from "../../../../../services/api";
import { toJS } from "mobx";

const useWallpaperImage = (currentChatWallpaper, localImage) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [chatWallpaperUrl, setChatWallpaperUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!currentChatWallpaper?.media?.url && !localImage) {
      setIsImageLoaded(false);
      setDimensions({ width: 0, height: 0 });
      return;
    }

    const imageUrl = localImage || `${RESOURCE_URL}/${currentChatWallpaper?.media?.url}?originalSize=true`;
    setChatWallpaperUrl(imageUrl)
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      if (isMounted) {
        setIsImageLoaded(true);
        const { width, height } = img;

        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 500;
        const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1);

        setDimensions({ width: Math.round(width * scale), height: Math.round(height * scale) });
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setIsImageLoaded(false);
        setDimensions({ width: 0, height: 0 });
      }
    };

    return () => {
      isMounted = false;
    };
  }, [currentChatWallpaper, localImage]);

  return { dimensions, isImageLoaded, chatWallpaperUrl };
};

export default useWallpaperImage;