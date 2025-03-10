import { memo } from "react";
import ChatStore from "../../../../store/chat/ChatStore";

const ChatForm = memo(({ data, onChange, onSubmit, showEditButton }) => {
    
    const haveRights = ChatStore.userHasRights

    return(
    <div className='chat-info__data'>
        <p className='chat-info__tag'>name: </p>
        <input readOnly={haveRights ? false : true} className={`chat-info__name ${!haveRights && 'input-disabled'}`} value={data.name} onChange={e => onChange('name', e.target.value)} />
        <hr className='chat-info__divider'/>
        {data.link !== undefined && (
            <>
                <p className='chat-info__tag'>link:</p>
                <input className={`chat-info__link ${!haveRights && 'input-disabled'}`} value={data.link} readOnly={haveRights ? false : true}
                    onChange={e => onChange('link', '@' + e.target.value.replace('@', ''))} />
                <hr className='chat-info__divider'/>
            </>
        )}
        <p className='chat-info__tag'>description:</p>
        <textarea className={`chat-info__description ${!haveRights && 'input-disabled'}`} value={data.description} 
            readOnly={haveRights ? false : true}
            onChange={e => onChange('description', e.target.value)} 
            placeholder='there is no description yet..' />
        <hr className='chat-info__divider'/>
        {showEditButton && <button onClick={onSubmit} className='chat-info__edit-button'>edit chat</button>}
    </div>
)});

export default ChatForm