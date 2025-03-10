import { useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useTimeString } from "../../../../hooks/useTimeString";
import UIStore from "../../../../store/UIStore";
import ChatStore from "../../../../store/chat/ChatStore";
import { RESOURCE_URL } from "../../../../services/api"; 
import MediaGrid from "../MediaGrid/MediaGrid";
import AudioPlayer from "../../../../shared/components/AudioPlayer";
import MessageFooter from "../MessageFooter/MessageFooter";
import MessageReply from "../MessageReply/MessageReply";
import MessageHeader from "../MessageHeader/MessageHeader";
import AuthStore from "../../../../store/AuthStore";
import SystemMessage from "../SystemMessage";
import { observer } from "mobx-react";


const Message = observer(({ message, isContinuation, isFirst }) => {
  const { id } = useParams();
  const timeString = useTimeString(message.createdAt);
  const isOwnMessage = message.from_user?._id === AuthStore.user._id;

  const handleContextMenu = useCallback(event => {
      event.preventDefault();
      event.stopPropagation();
      ChatStore.selectMessage(message);
      UIStore.showContextMenu(event.clientX, event.clientY);
  }, [message]);

  const scrollToMessage = useCallback(messageId => {
      const element = document.getElementById(messageId);
      if (!element) {
          ChatStore.getMessagesUntilTarget({ chatId: id, messageId });
      }
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [id]);

  if (message.metadata) return <SystemMessage metadata={message.metadata} />;

  const messageClass = `message ${isOwnMessage ? 'message--own' : ''} ${isContinuation ? 'message--continuation' : ''} ${!isFirst ? 'message--not-first' : ''}`;

  return (
      <div onContextMenu={handleContextMenu} className={messageClass} id={message._id}>
          {!isOwnMessage && (
              <NavLink to={`/user/${message.from_user._id}`}>
                  <div className='message__avatar'>
                      <img 
                          className='message__avatar-img' 
                          src={`${RESOURCE_URL}/${message.from_user.avatar?.url}`} 
                          alt={message.from_user?.name} 
                      />
                  </div>
              </NavLink>
          )}
          
          <div className={`message__content ${message.type === 'combined' && message.media.length > 0 && 'message__content--media'}`}>
              {(!isOwnMessage && !isContinuation) && (
                  <MessageHeader 
                      author={message.from_user.name}
                      role={message.from_member?.role}
                  />
              )}
              
              {message.reply_to_message && (
                  <MessageReply 
                      replyMessage={message.reply_to_message}
                      onReplyClick={() => scrollToMessage(message.reply_to_message._id)}
                  />
              )}
              
              {message.type === 'combined' && message.media.length > 0 && (
                  <MediaGrid media={message.media} />
              )}
              
              {message.text && <p className="message__text">{message.text}</p>}
              
              {message.type === 'audio' && (
                  <AudioPlayer audioUrl={`${RESOURCE_URL}/${message.media[0].url}`} />
              )}
              
              <MessageFooter isEdited={message.isEdited} time={timeString} />
          </div>
      </div>
  );
});

export default Message;