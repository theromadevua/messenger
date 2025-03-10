import { observer } from "mobx-react";
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SideBar from "../chat/components/SideBar/SideBar";
import { connectSocket, disconnectSocket } from '../services/socket/socketClient';
import MainStore from '../store/MainStore';
import UIStore from "../store/UIStore";

const ChatContent = lazy(() => import("../chat/components/Chat/ChatContent"));
const ChatInfo = lazy(() => import("../chat/components/ChatInfo/ChatInfo"));

const ChatLayout = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket(navigate);
    return disconnectSocket;
  }, []);

  const handleClickOutside = (e) => {
    e.preventDefault();
    UIStore.resetMenus();
  };

  const renderDesktopContent = () => (
    <>
      <SideBar />
      <div className="chat__main-container">
        <Routes>
          <Route path="/" element={null} />
          <Route 
            path="chat/:id" 
            element={
              <>
                <div className="chat__content-wrapper">
                  <Suspense fallback={<div className="chat__loading">Loading...</div>}>
                    <ChatContent />
                  </Suspense>
                </div>
                <Suspense fallback={<div className="chat-info chat-info--loading">Loading...</div>}>
                  <ChatInfo />
                </Suspense>
              </>
            } 
          />
          <Route 
            path="chatInfo/:id" 
            element={
              <>
                <div className="chat__content-wrapper">
                  <Suspense fallback={<div className="chat__loading">Loading...</div>}>
                    <ChatContent />
                  </Suspense>
                </div>
                <Suspense fallback={<div className="chat-info chat-info--loading">Loading...</div>}>
                  <ChatInfo />
                </Suspense>
              </>
            } 
          />
          <Route 
            path="user/:id" 
            element={
              <>
                <div className="chat__content-wrapper">
                  <Suspense fallback={<div className="chat__loading">Loading...</div>}>
                    <ChatContent />
                  </Suspense>
                </div>
                <Suspense fallback={<div className="chat-info chat-info--loading">Loading...</div>}>
                  <ChatInfo />
                </Suspense>
              </>
            } 
          />
        </Routes>
      </div>
    </>
  );

  const renderMobileContent = () => (
    <Routes>
      <Route path="/" element={<SideBar />} />
      <Route 
        path="chat/:id" 
        element={
          <Suspense fallback={<div className="chat__loading">Loading...</div>}>
            <ChatContent />
          </Suspense>
        } 
      />
      <Route 
        path="chatInfo/:id" 
        element={
          <Suspense fallback={<div className="chat-info chat-info--loading">Loading...</div>}>
            <ChatInfo />
          </Suspense>
        } 
      />
      <Route 
        path="userInfo/:id" 
        element={
          <Suspense fallback={<div className="chat-info chat-info--loading">Loading...</div>}>
            <ChatInfo />
          </Suspense>
        } 
      />
      <Route 
        path="user/:id" 
        element={
          <Suspense fallback={<div className="chat__loading">Loading...</div>}>
            <ChatContent />
          </Suspense>
        } 
      />
    </Routes>
  );

  return (
    <div className="chat" onClick={handleClickOutside} onContextMenu={handleClickOutside}>
      {MainStore.isMobile ? renderMobileContent() : renderDesktopContent()}
    </div>
  );
});

export default ChatLayout;