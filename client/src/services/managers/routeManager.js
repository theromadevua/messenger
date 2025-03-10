import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';
import ChatStore from '../../store/chat/ChatStore';
import MainStore from '../../store/MainStore';
import { toJS } from 'mobx';

const ROUTES = {
  LOGIN: '/login',
  REGISTRATION: '/registration',
  HOME: '/',
  CHAT: '/chat/:id',
  CHAT_INFO: '/chatInfo/:id',
  USER_INFO: '/userInfo/:id',
  USER: '/user/:id',
};

export const useRouteManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthRouting = useCallback(() => {
    const isAuthPage = [ROUTES.LOGIN, ROUTES.REGISTRATION].includes(location.pathname);
    console.log('aaaa')
    if (!AuthStore.isAuthenticated) {
      !isAuthPage && navigate(ROUTES.LOGIN, { replace: true });
    } else {
      if (isAuthPage) {
        navigate(ROUTES.HOME, { replace: true });
      } else if (!ChatStore.state.chats.length) {
        ChatStore.chatManager.getUserPublicChats();
      }
    }
  }, [navigate, location.pathname, AuthStore.isAuthenticated]);

  const handleUserRoute = useCallback((userId) => {
    ChatStore.resetChat();
    
    if (userId === AuthStore.user._id) {
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    const existingChat = ChatStore.state.chats?.find(chat => chat.with_user === userId);
    if (existingChat) {
      navigate(`/chat/${existingChat._id}`, { replace: true });
      return;
    }

    ChatStore.chatManager.getUser(userId);
    ChatStore.chatManager.setCurrentChat();

    MainStore.setIsActiveChatBar();
  }, [navigate]);

  const handleChatRoute = useCallback((chatId) => {
    ChatStore.chatManager.setCurrentChat(chatId);
    MainStore.setIsActiveChatBar();
  }, []);

  const handleUserInfoRoute = useCallback((userId) => {
    ChatStore.chatManager.getUser(userId);
  }, []);

  const handleRouteLogic = useCallback(() => {
    if (ChatStore.state.isLoadingChats) return;

    
    const matches = {
      user: matchPath(ROUTES.USER, location.pathname),
      chat: matchPath(ROUTES.CHAT, location.pathname),
      login: matchPath(ROUTES.LOGIN, location.pathname),
      chatInfo: matchPath(ROUTES.CHAT_INFO, location.pathname),
      userInfo: matchPath(ROUTES.USER_INFO, location.pathname),
    };

    if (matches.user) {
      handleUserRoute(matches.user.params.id);
    } else if (matches.chat) {
      handleChatRoute(matches.chat.params.id);
    } else if (matches.userInfo && !MainStore.isMobile) {
      navigate(`/user/${matches.userInfo.params.id}`)
    } else if (matches.chatInfo && !MainStore.isMobile) {
      navigate(`/chat/${matches.chatInfo.params.id}`)
    } else if (matches.chatInfo) {
      handleChatRoute(matches.chatInfo.params.id);
    } else if (matches.userInfo) {
      handleUserInfoRoute(matches.userInfo.params.id);
    } else if (matches.login && AuthStore.isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    } else if (AuthStore.isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
      ChatStore.resetChat();
    }
  }, [location.pathname, MainStore.isMobile, ChatStore.state.isLoadingChats, AuthStore.isAuthenticated, navigate]);

  return {
    handleAuthRouting,
    handleRouteLogic
  };
};