import { memo } from "react";

const MessageFooter = memo(({ isEdited, time }) => (
    <div className="message__footer">
        {isEdited && <span className="message__edited">edited</span>}
        <span className="message__time">{time}</span>
    </div>
));

export default MessageFooter