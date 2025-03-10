import React, { useState } from 'react';

const LazyLoadImage = ({ src, placeholder, alt = '', className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`${className} lazy-load-wrapper`}>
      <img
        src={placeholder}
        alt={alt}
        className="lazy-load-placeholder"
        style={{ opacity: isLoaded ? 0 : 1 }}
      />
      <img
        src={src}
        alt={alt}
        className="lazy-load-image"
        onLoad={() => setIsLoaded(true)}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
    </div>
  );
};

export default LazyLoadImage;
