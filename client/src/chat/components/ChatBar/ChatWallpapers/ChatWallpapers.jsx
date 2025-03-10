import React from 'react';
import { observer } from 'mobx-react';
import useGetImageUrl from './hooks/useGetImageUrl';

const ChatWallpapers = () => {
  const {blackoutValue, isBlurred, mainImageLoaded, wallpaperUrl, getImageUrl} = useGetImageUrl()

  return (
    <div className="chat-bar__wallpaper">
      {wallpaperUrl && (
        <>
          <div 
            className="chat-bar__wallpaper-mockup"
            style={{
              backgroundImage: `url(${getImageUrl(5)})`,
              opacity: mainImageLoaded ? 0 : 1,
            }}
          />
          <div
            className="chat-bar__wallpaper-image"
            style={{    
              backgroundImage: `url(${getImageUrl()})`,       
              opacity: mainImageLoaded ? 1 : 0,   
            }}
          />
        </>
      )}

      <div
        className='chat-bar__wallpaper-overlay'
        style={{
          backgroundColor: `rgba(0,0,0,${blackoutValue})`,
          backdropFilter: isBlurred ? 'blur(15px)' : 'none',
        }}
      />
    </div>
  );
};

export default observer(ChatWallpapers);
