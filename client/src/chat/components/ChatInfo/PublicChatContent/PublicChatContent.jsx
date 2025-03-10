import { observer } from "mobx-react";
import AddUser from "../AddUser";
import ChatMembers from "../ChatMembers";
import AddUserButton from "../AddUserButton";
import ImageUploader from "../ImageUploader";
import ChatForm from "../ChatForm";


const PublicChatContent = ({ 
    previewUrl, 
    onAvatarClick, 
    onAvatarChange, 
    canvasRef, 
    fileInputRef,
    formData,
    onFormChange,
    onSubmit,
    showEditButton 
}) => (
    <>
        <AddUserButton />
        <AddUser />
        <ImageUploader 
            id={formData._id}
            privateChat={false}
            previewUrl={previewUrl}
            onAvatarClick={onAvatarClick}
            onAvatarChange={onAvatarChange}
            canvasRef={canvasRef}
            fileInputRef={fileInputRef}
        />
        <ChatForm 
            data={formData}
            onChange={onFormChange}
            onSubmit={onSubmit}
            showEditButton={showEditButton}
        />
        <ChatMembers />
    </>
);

export default observer(PublicChatContent)