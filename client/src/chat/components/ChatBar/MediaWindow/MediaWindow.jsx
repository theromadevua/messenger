import { observer } from "mobx-react";
import { Download, X } from "lucide-react";
import AnimatedModal from "../../../../shared/components/AnimatedModal";
import Spinner from "../../../../shared/components/Spinner";
import { RESOURCE_URL } from "../../../../services/api";
import ChatStore from "../../../../store/chat/ChatStore";
import useMediaDimensions from "./hooks/useMediaDimension";

export const MediaWindow = observer(() => {
  const { dimensions, isLoaded, isOpened, handleClose, imageUrl } = useMediaDimensions();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${RESOURCE_URL}/download/${ChatStore.state.currentMedia?.url}?quality=100`;
    link.download = 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatedModal isOpen={isOpened} onClose={handleClose}>
      <div className="media-window__content" onClick={e => e.stopPropagation()}>
        <img
          className="media-window__image"
          src={imageUrl}
          alt=""
          style={{ width: `${dimensions?.width}px`, height: `${dimensions?.height}px` }}
          onContextMenu={e => e.stopPropagation()}
        />
        {!isLoaded && (
          <div className="media-window__loader">
            <Spinner size={24} />
          </div>
        )}
        <div className="media-window__buttons-container" onClick={handleClose}>
          <button className="media-window__button" onClick={handleClose}>
            <X />
          </button>
          <button className="media-window__button" onClick={e => { e.stopPropagation(); handleDownload(); }}>
            <Download />
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
});
