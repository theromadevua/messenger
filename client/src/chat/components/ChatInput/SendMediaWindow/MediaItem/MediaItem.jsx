import { X } from "lucide-react";
import MainStore from "../../../../../store/MainStore";
import ChatStore from "../../../../../store/chat/ChatStore";

const getStyle = (count) => {
    const styles = [
        {},
        { height: 500, maxWidth: MainStore.isMobile ? 400 : 500 },
        { maxHeight: 300 },
        { width: 300, height: 300, maxWidth: MainStore.isMobile ? 200 : 'none' }
    ];
    return styles[count - 1] || '';
};

const MediaItem = ({ media, index, onRemoveMedia }) => {
    const handleRemove = () => {
        const updatedMedia = ChatStore.state.messageMedia.filter(m => m !== media);
        ChatStore.messageManager.setMessageMedia(updatedMedia);
        if (updatedMedia.length === 0) onRemoveMedia();
    };

    return (
        <div style={{ position: 'relative' }}>
            <img src={media} alt={`media-${index}`} className="media-window__image" style={getStyle(ChatStore.state.messageMedia.length)} />
            <button onClick={handleRemove} className='media-window__image-close-icon'>
                <X size={24} />
            </button>
        </div>
    );
};

export default MediaItem;