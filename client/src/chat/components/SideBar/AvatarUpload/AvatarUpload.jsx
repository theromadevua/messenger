import { useEffect, useRef } from "react";
import { useHandleImageCrop } from "../../../../hooks/useHandleImageCrop";
import { PlusCircle } from "lucide-react";

const AvatarUpload = ({ previewUrl: initialPreviewUrl, setAvatar }) => {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const {avatar, previewUrl, handleImageCrop} = useHandleImageCrop(canvasRef);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleImageCrop(file);
  };

  useEffect(() => {
    if(avatar){
      setAvatar(avatar)
    }
  }, [avatar])

  return (
    <div className='settings__avatar-preview' onClick={() => fileInputRef.current?.click()}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {previewUrl || initialPreviewUrl ? <img src={previewUrl || initialPreviewUrl} alt="Avatar preview"/> : <PlusCircle size={35}/>}
    </div>
  );
};
  export default AvatarUpload