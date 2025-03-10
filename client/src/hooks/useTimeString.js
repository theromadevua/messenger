import { useEffect, useState } from "react";
import { formatTime } from "../utils/formatTime";

export const useTimeString = (createdAt) => {
    const [timeString, setTimeString] = useState('');

    useEffect(() => {
        const updateTime = () => setTimeString(formatTime(createdAt));
        updateTime();
        const intervalId = setInterval(updateTime, 60000);
        return () => clearInterval(intervalId);
    }, [createdAt]);

    return timeString;
};