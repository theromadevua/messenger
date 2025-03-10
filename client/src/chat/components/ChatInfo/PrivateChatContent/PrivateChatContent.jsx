import { memo } from "react";
import ImageUploader from "../ImageUploader";
import ChatForm from "../ChatForm";

const PrivateChatContent = memo(({ 
    previewUrl, 
    canvasRef, 
    formData, 
    onFormChange 
}) => (
    <>
        <ImageUploader 
            id={formData._id}
            previewUrl={previewUrl} 
            canvasRef={canvasRef}
            privateChat={true}
        />
        <ChatForm 
            data={formData}
            onChange={onFormChange}
        />
    </>
));

export default PrivateChatContent