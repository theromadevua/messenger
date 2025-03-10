import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import Message from '../Message/Message';

const ChatMessages = ({ messages }) => {
  const reversedMessages = messages.slice().reverse(); 

  return (
    <div>
      {reversedMessages.map((message, index) => {
        const previousMessage = reversedMessages[index - 1]; 
        let isContinuation = false;

        if (previousMessage && previousMessage.from_user && message.from_user) {
          const isSameUser = previousMessage.from_user._id === message.from_user._id;
          const timeDifference = (new Date(message.createdAt) - new Date(previousMessage.createdAt)) / 60000;
          isContinuation = isSameUser && timeDifference <= 10;
          console.log(timeDifference); 
        }

        return (
          <Message 
            key={message._id} 
            message={message} 
            isContinuation={isContinuation}
            isFirst={!previousMessage || (previousMessage.from_user && previousMessage.from_user._id !== message.from_user._id)}
          />
        );
      })}
    </div>
  );
};

export default observer(ChatMessages);