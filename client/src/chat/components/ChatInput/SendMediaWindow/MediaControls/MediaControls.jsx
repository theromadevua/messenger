import { X, CirclePlus } from "lucide-react";
import ChatStore from "../../../../../store/chat/ChatStore";

const MediaControls = ({ onClose, addImage }) => (
    <div className="media-window__buttons-container" onClick={onClose}>
        <button className='media-window__button' onClick={onClose}>
            <X size={24} />
        </button>
        {ChatStore.state.messageMedia.length < 4 && (
            <button className='media-window__button' onClick={e => { e.stopPropagation(); addImage(); }}>
                <CirclePlus size={18} /> Add Image
            </button>
        )}
    </div>
);

export default MediaControls;