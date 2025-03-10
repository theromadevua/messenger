import React, { useMemo } from 'react';

const useCalculateDimensions = (aspectRatio, isSingle) => {

    const dimensions = useMemo(() => {
        if (!isSingle || !aspectRatio) return null;

        const maxWidth = 379;
        const maxHeight = 300;

        if (aspectRatio > maxWidth / maxHeight) {
            return {
                width: maxWidth,
                height: Math.round(maxWidth / aspectRatio)
            };
        } else {
            return {
                width: Math.round(maxHeight * aspectRatio),
                height: maxHeight
            };
        }
    }, [aspectRatio, isSingle]);

  return {dimensions}
};

export default useCalculateDimensions;