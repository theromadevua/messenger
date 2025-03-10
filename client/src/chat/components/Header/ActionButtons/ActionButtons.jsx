import { X } from "lucide-react";

;
const ActionButtons = ({ onClose, onReset }) => (
    <div className="media-window__buttons-container" onClick={onClose}>
      <button className="media-window__button" onClick={onClose}>
        <X size={24}/>
      </button>
      <button 
        className="media-window__button" 
        onClick={(e) => {
          e.stopPropagation();
          onReset();
        }}
      >
        Reset Wallpapers
      </button>
    </div>
  );

  export default ActionButtons