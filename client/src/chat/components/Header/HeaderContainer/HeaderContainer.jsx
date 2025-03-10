

import React from 'react';
import MainStore from '../../../../store/MainStore';
import ChatStore from '../../../../store/chat/ChatStore';
import { ChatInfo, UserInfo } from '../HeaderComponents';
import { CSSTransition } from 'react-transition-group';
import UIStore from '../../../../store/UIStore';
import { observer } from 'mobx-react';
import ChatMenu from '../ChatMenu';
import UserStore from '../../../../store/UserStore';

const HeaderContainer = ({handleBack, handleMenuClick, setShowConfirmWindow}) => {

    const user = UserStore.getUser(ChatStore.state.anotherUserData?._id);

  return (
    <>
        <div className='header__container'>
            {MainStore.isMobile && (
                <svg className='navigate-button' onClick={handleBack} width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="white"/>
                </svg>
            )}
            {ChatStore.state.currentChat?.type === 'public' 
                ? <ChatInfo 
                    id={ChatStore.state.currentChat?._id}
                    name={ChatStore.state.currentChat?.name} 
                    membersCount={ChatStore.state.currentChat?.members.length} 
                    avatar={ChatStore.state.currentChat?.avatar}
                /> 
                : ChatStore.state.anotherUserData && <UserInfo 
                    id={ChatStore.state.anotherUserData?._id}
                    name={ChatStore.state.anotherUserData?.name} 
                    status={user?.online ? 'online' : 'offline'} 
                    avatar={ChatStore.state.anotherUserData?.avatar}
                />
            } 
        </div>
        <div className='navigate-button' onClick={handleMenuClick} style={{position: 'relative'}}>
            <CSSTransition in={UIStore.modals.chatMenu} timeout={300} classNames="menu" unmountOnExit>
                <ChatMenu setShowConfirmWindow={setShowConfirmWindow}/>
            </CSSTransition>
            <div className={`menu-btn menu-btn--header`}>
                <div className="btn-line"></div>
                <div className="btn-line"></div>
                <div className="btn-line"></div>
            </div>
        </div>
    </>

  );
};

export default observer(HeaderContainer);