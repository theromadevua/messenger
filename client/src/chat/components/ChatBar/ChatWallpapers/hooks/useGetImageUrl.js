import { useCallback, useEffect, useState } from 'react';
import { RESOURCE_URL } from '../../../../../services/api';
import ChatStore from '../../../../../store/chat/ChatStore';

const useGetImageUrl = () => {
    const [mainImageLoaded, setMainImageLoaded] = useState(false);
    const wallpaperUrl = ChatStore.state?.currentChat?.chatWallpaper?.media?.url;
    const blackoutValue = ChatStore.state?.currentChat?.chatWallpaper?.data?.blackout;
    const isBlurred = ChatStore.state?.currentChat?.chatWallpaper?.data?.isBlurred;

    const getImageUrl = useCallback((quality = 100, size = 'original') => {
        if (!wallpaperUrl) return '';
        return `${RESOURCE_URL}/${wallpaperUrl}?quality=${quality}${size === 'original' ? '&originalSize=true' : ''}`;
      }, [wallpaperUrl]);
      

    useEffect(() => {
        if (wallpaperUrl) {
        const img = new Image();
        img.src = getImageUrl();
        img.onload = () => {
            setMainImageLoaded(true);
        };
        }
    }, [wallpaperUrl]);
    
    return {blackoutValue, isBlurred, mainImageLoaded, wallpaperUrl, getImageUrl};
};

export default useGetImageUrl;