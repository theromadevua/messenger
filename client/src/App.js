import { observer } from "mobx-react";
import { lazy, Suspense, useEffect } from "react";
import { useResponsiveManager } from "./hooks/useResponsiveManager";
import { useRouteManager } from "./services/managers/routeManager";
import { Route, Routes } from "react-router-dom";
import '../src/styles/main.scss';

const ChatLayout = lazy(() => import("./pages/ChatLayout"));
const Login = lazy(() => import("./pages/Login"));
const Registration = lazy(() => import("./pages/Registration"));

const App = observer(() => {
  const { handleAuthRouting, handleRouteLogic } = useRouteManager();
  useResponsiveManager();

  useEffect(() => {
    handleAuthRouting();
  }, [handleAuthRouting]);

  useEffect(() => {
    handleRouteLogic();
  }, [handleRouteLogic]);

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={
            <Suspense fallback={<div className="chat__loading">Loading...</div>}>
              <Login />
            </Suspense>
          } 
        />
        <Route 
          path="/registration" 
          element={
            <Suspense fallback={<div className="chat__loading">Loading...</div>}>
              <Registration />
            </Suspense>
          } 
        />
        <Route path="/*" element={
            <Suspense fallback={<div className="chat__loading">Loading...</div>}>
              <ChatLayout />
            </Suspense>
        } />
      </Routes>
    </div>
  );
});

export default App;