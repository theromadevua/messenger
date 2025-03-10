import { observer } from "mobx-react";
import ChatStore from "../../../../store/chat/ChatStore";
import UIStore from "../../../../store/UIStore";
import ImagePreview from "../ImagePreview";
import WallpaperControls from "../WallpaperControls/WallpaperControls";
import ActionButtons from "../ActionButtons";
import AnimatedModal from "../../../../shared/components/AnimatedModal";
import useWallpaperImage from "./hooks/useWallpaperImage";
import useWallpaperControls from "./hooks/useWallpaperControls";
import useWallpaperManager from "./hooks/useWallpaperManager";

const SetWallpapersWindow = observer(() => {
  const currentChat = ChatStore.state?.currentChat;
  const { isBlurred, setIsBlurred, blackout, setBlackout } = useWallpaperControls(currentChat);
  const { localImage, fileInputRef, handleFileChange, handleSave, handleClose, resetWallpapers } = useWallpaperManager(currentChat, isBlurred, blackout, setIsBlurred, setBlackout);
  const { dimensions, isImageLoaded, chatWallpaperUrl } = useWallpaperImage(currentChat?.chatWallpaper, localImage);

  if (!currentChat) return null;

  return (
    <AnimatedModal isOpen={UIStore.modals.wallpaperWindow} onClose={handleClose}>
      <div className="media-window__content" onClick={(e) => e.stopPropagation()}>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <h1 className='media-window__title'>Choose wallpapers for the chat background</h1>

        <ImagePreview
          chatWallpaperUrl={chatWallpaperUrl}
          isImageLoaded={isImageLoaded}
          dimensions={dimensions}
          localImage={localImage}
          blackout={blackout}
          isBlurred={isBlurred}
          onImageClick={() => fileInputRef.current.click()}
          onContextMenu={(e) => e.stopPropagation()}
        />

        <WallpaperControls
          isBlurred={isBlurred}
          setIsBlurred={setIsBlurred}
          blackout={blackout}
          setBlackout={setBlackout}
          onSave={handleSave}
        />

        <ActionButtons onClose={handleClose} onReset={resetWallpapers} />
      </div>
    </AnimatedModal>
  );
});

export default SetWallpapersWindow;
