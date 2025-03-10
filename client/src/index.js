import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import AuthStore from './store/AuthStore';
import { Provider } from 'mobx-react';
import ChatStore from './store/chat/ChatStore';
import MainStore from './store/MainStore';
import UserStore from './store/UserStore';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Provider userStore={UserStore} authStore={AuthStore} chatStore={ChatStore} mainStore={MainStore}>
    <App />
    </Provider>
  </BrowserRouter>
    
);
