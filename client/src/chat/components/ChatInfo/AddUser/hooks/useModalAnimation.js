import { useEffect, useState } from "react";

export const useModalAnimation = (isOpen) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        let timer;
        if (isOpen) {
            timer = setTimeout(() => setShowContent(true), 150);
        } else {
            setShowContent(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    return showContent;
};
