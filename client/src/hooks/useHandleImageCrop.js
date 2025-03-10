import { useState, useCallback, useEffect } from 'react';

export const useHandleImageCrop = (canvasRef) => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageCrop = useCallback(async (file) => {
        if (!canvasRef?.current) return;

        const img = await createImageBitmap(file);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height);

        canvas.width = canvas.height = 512;
        ctx.clearRect(0, 0, 512, 512);
        ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            512,
            512
        );

        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', 0.9)
        );
        setAvatar(blob);
        setPreviewUrl(prev => URL.createObjectURL(blob));
    }, [canvasRef]);

    return {
        setPreviewUrl,
        avatar,
        setAvatar,
        previewUrl,
        handleImageCrop,
    };
};