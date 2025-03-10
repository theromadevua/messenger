import { useEffect, useState } from "react";
import UIStore from "../../../../../store/UIStore";

const useWallpaperControls = (currentChat) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [blackout, setBlackout] = useState(0);

  useEffect(() => {
    if (!UIStore.modals.wallpaperWindow || !currentChat) return;

    setIsBlurred(currentChat?.chatWallpaper?.data?.isBlurred);
    setBlackout(currentChat?.chatWallpaper?.data?.blackout);
  }, [UIStore.modals.wallpaperWindow, currentChat]);

  return { isBlurred, setIsBlurred, blackout, setBlackout };
};

export default useWallpaperControls;