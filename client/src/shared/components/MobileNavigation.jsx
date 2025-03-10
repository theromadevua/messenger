import { CSSTransition } from 'react-transition-group';
import UIStore from '../../store/UIStore';
import { observer } from 'mobx-react';
import ChatMenu from '../../chat/components/Header/ChatMenu/ChatMenu';
import { useNavigate } from 'react-router-dom';
import ChatStore from '../../store/chat/ChatStore';

const MobileNavigation = observer(({setShowConfirmWindow}) => {
    const navigate = useNavigate(); 
    
    const handleBackClick = () => {
        if(ChatStore.state.currentChat){
            navigate(`/chat/${ChatStore.state.currentChat?._id}`);
        } else{
            navigate(`/user/${ChatStore.state.anotherUserData?._id}`)
        };
    } 
    
    const handleMenuClick = () => {UIStore.showChatMenu()};

    return (
        <div className='chat-info__mobile-navigation-block'>
            <svg 
                className='navigate-button' 
                onClick={handleBackClick} 
                width="24" 
                height="24" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="white"/>
            </svg>
            <div className='navigate-button'>
                <svg 
                    onClick={handleMenuClick} 
                    width="24" 
                    height="24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="white"/>
                </svg>
                <CSSTransition 
                    in={UIStore.modals.chatMenu} 
                    timeout={300} 
                    classNames="menu" 
                    unmountOnExit
                >
                    <ChatMenu setShowConfirmWindow={setShowConfirmWindow}/>
                </CSSTransition>
            </div>
        </div>
    );
});

export default MobileNavigation