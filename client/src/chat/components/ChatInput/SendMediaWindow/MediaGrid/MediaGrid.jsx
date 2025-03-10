import ChatStore from "../../../../../store/chat/ChatStore";
import MediaItem from "../MediaItem";

const getGridClass = count => {
    const classes = ['grid-one', 'grid-two', 'grid-three', 'grid-four'];
    return classes[count - 1] || '';
};

const MediaGrid = ({ onClose }) => (
    <div className={`media-window__images ${getGridClass(ChatStore.state.messageMedia.length)}`}>
        {ChatStore.state.messageMedia.map((media, index) => (
            <MediaItem key={index} media={media} index={index} onRemoveMedia={onClose} />
        ))}
    </div>
);

export default MediaGrid;