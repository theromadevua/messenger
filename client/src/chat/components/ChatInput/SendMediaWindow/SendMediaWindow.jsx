import { useEffect, useState } from "react";
import ChatStore from "../../../../store/chat/ChatStore";
import AnimatedModal from "../../../../shared/components/AnimatedModal";
import MediaGrid from "./MediaGrid";
import MediaInput from "./MediaInput";
import MediaControls from "./MediaControls";
import { observer } from "mobx-react";

const SendMediaWindow = observer(({ text, setText, handleSubmit, addImage }) => {
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        if (!ChatStore.state.messageMedia?.length) {
            setIsOpened(false);
            return;
        }
        const img = new Image();
        img.src = ChatStore.state.messageMedia[0];
        img.onload = () => setIsOpened(true);
        img.onerror = () => console.error("Image loading error:", ChatStore.state.messageMedia);
    }, [ChatStore.state.messageMedia]);

    const handleClose = () => {
        setTimeout(() => ChatStore.messageManager.setMessageMedia(null), 300);
        setIsOpened(false);
    };

    return (
        <AnimatedModal isOpen={isOpened} onClose={handleClose}>
            <div className="media-window__content" onClick={e => e.stopPropagation()}>
                <MediaGrid onClose={handleClose}/>
                <MediaInput text={text} setText={setText} handleSubmit={handleSubmit} closeWindow={handleClose} />
                <MediaControls onClose={handleClose} addImage={addImage} />
            </div>
        </AnimatedModal>
    );
});

export default SendMediaWindow;