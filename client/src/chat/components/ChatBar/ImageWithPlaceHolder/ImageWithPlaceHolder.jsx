import { useCallback, useMemo, useState } from "react";
import ChatStore from "../../../../store/chat/ChatStore";
import Spinner from "../../../../shared/components/Spinner";
import { observer } from "mobx-react";
import useCalculateDimensions from "./hooks";

const ImageWithPlaceholder = observer(({ 
    url, 
    width, 
    height, 
    aspectRatio, 
    onLoad, 
    className,
    isSingle 
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const {dimensions} = useCalculateDimensions(aspectRatio, isSingle);

    const handleMediaOpen = useCallback(() => {
        ChatStore.setCurrentMedia({url, width, height, aspectRatio});
    }, [url]);

    const imageUrls = useMemo(() => ({
        placeholder: `${url}?quality=100&size=30`,
        full: `${url}?quality=100&size=379`
    }), [url]);

    return (
        <div
            onClick={handleMediaOpen}
            className={`media-container ${isLoading ? 'loading' : ''} ${className}`}
            style={dimensions ? {
                width: dimensions.width,
                height: dimensions.height
            } : undefined}
        >
            <div 
                className="placeholder"
                style={{
                    backgroundImage: `url(${imageUrls.placeholder})`,
                    display: isLoading ? 'flex' : 'none'
                }}
            >
                <div className="loader">
                    <Spinner size={32}/>
                </div>
            </div>

            <img
                src={imageUrls.full}
                alt=""
                style={{
                    opacity: isLoading ? 0 : 1,
                    cursor: isLoading ? 'wait' : 'pointer'
                }}
                onLoad={() => {
                    setIsLoading(false);
                    onLoad?.();
                }}
            />
        </div>
    );
});

export default ImageWithPlaceholder;