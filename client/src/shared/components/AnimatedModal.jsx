import { CSSTransition } from "react-transition-group";
import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";

const AnimatedModal = observer(({ 
    isOpen, 
    onClose, 
    children, 
    backgroundClassName = "media-window",
    contentClassName = "",
    backgroundClassNames = "media-content-background",
    animationClassNames = "media-content",
    timeout = 300,
    contentDelay = 10
}) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setTimeout(() => {
                setShowContent(true);
            }, contentDelay);
        } else {
            setShowContent(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen, contentDelay]);

    const handleBackgroundClick = useCallback(() => {
        onClose();
    }, []);

    return (
        <CSSTransition
            in={isOpen}
            timeout={timeout}
            classNames={backgroundClassNames}
            unmountOnExit
        >
            <div className={`${backgroundClassName} ${contentClassName}`} onClick={handleBackgroundClick}>
                <CSSTransition
                    in={showContent}
                    timeout={timeout}
                    classNames={`${animationClassNames} media-content`}
                    unmountOnExit
                >
                    {children}
                </CSSTransition>
            </div>
        </CSSTransition>
    );
});

export default AnimatedModal;