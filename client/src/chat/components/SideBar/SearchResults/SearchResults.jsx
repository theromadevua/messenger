import { observer } from "mobx-react";
import ChatItem from "../ChatItem";
import { toJS } from "mobx";
import { memo } from "react";

const SearchResults = memo(({ searchedData }) => {
        
    return (
    <>
        <div className='side-bar__search-results'>search results:</div>
        {searchedData.map(chat => (
            <ChatItem 
                key={chat._id} 
                id={chat.type ? chat._id : null} 
                userId={chat._id || null}
                name={chat.name}
                last_message={chat.last_message} 
                avatar={chat.avatar} 
                type={chat.type}
            />
        ))}
    </>
)});

export default SearchResults