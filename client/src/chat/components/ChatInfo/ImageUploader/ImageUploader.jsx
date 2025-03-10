import { useUserColor } from "../../../../hooks/useUserColor";
import { useFindChatDataManager } from "../../../../hooks/useFindChatDataManager";
import { memo, useCallback, useRef } from "react";

const ImageUploader = memo(({ 
    previewUrl, 
    onAvatarChange, 
    canvasRef, 
    privateChat,
    id
}) => {
    const fileInputRef = useRef(null);
    const { chatData, hasRights } = useFindChatDataManager(privateChat, id);
    const userColor = useUserColor(id);

    const onAvatarClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const renderContent = () => {
        if (previewUrl) {
            return <img src={previewUrl} alt="" />;
        }
       
        return (
            <div
                className={`avatar-placeholder ${!hasRights && 'input-disabled'}`}
                style={{
                    fontSize: 65,
                    backgroundColor: userColor,
                }}
            >
                {chatData.displayName}
            </div>
        );
    };

    return (
        <div
            className={`chat-info__avatar ${!hasRights && 'input-disabled'}`}
            onClick={() => {if(hasRights) onAvatarClick()}}
        >
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <input
                type="file"
                onClick={e => e.stopPropagation()}
                accept="image/*"
                ref={fileInputRef}
                onChange={onAvatarChange}
                style={{ display: 'none' }}
            />
            {renderContent()}
        </div>
    );
});

export default ImageUploader;