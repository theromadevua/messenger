import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import ChatStore from '../../../../store/chat/ChatStore';
import Settings from '../Settings';
import CreateChat from '../CreateChat';
import MenuButton from '../MenuBtn';
import ChatList from '../ChatList';
import SearchBar from '../SearchBar';
import SearchResults from '../SearchResults';
import useChatSearch from './hooks/useChatSearch';
import useChatsData from './hooks/useChatsData';

const SideBar = () => {
    const [query, setQuery] = useState('');
    const searchInputRef = useRef();

    const handleSetQuery = useCallback((value) => {
        setQuery(value);
    }, []);

    useChatSearch(query);

    const { chatsData, searchedData } = useChatsData();

    return (
        <div className='side-bar'>
            <div className='side-bar__search-block'>
                <MenuButton />
                <SearchBar query={query} setQuery={handleSetQuery} searchInputRef={searchInputRef} />
                <Settings />
                <CreateChat />
            </div>
            {!query.trim() && <ChatList searchedData={searchedData} chats={chatsData} />}
            {query.trim() && <SearchResults searchedData={searchedData} />}
        </div>
    );
};

export default observer(SideBar);
