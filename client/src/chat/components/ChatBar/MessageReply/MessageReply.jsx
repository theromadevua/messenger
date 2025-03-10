import { memo } from "react";

const MessageReply = memo(({ replyMessage, onReplyClick }) => (
    <div className="message__reply" onClick={onReplyClick}>
        <svg className="message__reply-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" fill="currentColor"/>
        </svg>
        <div className="message__reply-content">
            <h3 className="message__reply-author">{replyMessage.from_user.name}</h3>
            <p className="message__reply-text">{replyMessage.text}</p>
        </div>
    </div>
));

export default MessageReply