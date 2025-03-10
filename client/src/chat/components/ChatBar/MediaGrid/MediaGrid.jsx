import { memo, useCallback } from "react";
import ImageWithPlaceholder from "../ImageWithPlaceHolder/ImageWithPlaceHolder";
import { RESOURCE_URL } from "../../../../services/api";

const MediaGrid = memo(({ media }) => {
    
    const getGridClassName = useCallback((length) => {
        if (length === 1) return 'grid-single';
        return 'grid-multi';
    }, []);

    return (
        <div className={`message__media-grid ${getGridClassName(media.length)}`}>
            {media.map((item) => (
                <ImageWithPlaceholder
                    key={item.url}
                    url={`${RESOURCE_URL}/${item.url}`}
                    width={item.width}
                    height={item.height}
                    aspectRatio={item.aspectRatio}
                    className="message__media-grid-item"
                    isSingle={media.length === 1}
                />
            ))}
        </div>
    );
});

export default MediaGrid;