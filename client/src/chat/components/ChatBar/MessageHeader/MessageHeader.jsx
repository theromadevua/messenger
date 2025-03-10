import { memo } from "react";


const MessageHeader = memo(({ author, role }) => (
    <div className="message__header">
        <h3 className="message__author">{author}</h3>
        {role !== 'MEMBER' && <h4 className="message__role">{role?.toLowerCase()}</h4>}
    </div>
));

export default MessageHeader