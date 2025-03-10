const ImagePreview = ({ 
    isImageLoaded,
    dimensions,
    localImage,
    chatWallpaperUrl,
    blackout,
    isBlurred,
    onImageClick,
    onContextMenu
  }) => (
    <div 
      className={`media-window__image-container ${isImageLoaded && 'image-loaded'}`}
      onClick={onImageClick}
    >
      <div 
        className='media-window__image-overlay'
        style={{
          ...(blackout ? { background: `rgba(0,0,0, ${blackout})` } : {}),
          ...(isBlurred ? { backdropFilter: 'blur(10px)' } : {})
        }}
      />
      <img
        className="media-window__image"
        src={localImage || `${chatWallpaperUrl}`}
        alt=""
        style={{
          width: dimensions.width ? `${dimensions.width}px` : "500px",
          height: dimensions.height ? `${dimensions.height}px` : "300px",
          cursor: "pointer",
          opacity: isImageLoaded ? 1 : 0,
        }}
        onContextMenu={onContextMenu}
      />
    </div>
  );
  

  export default ImagePreview