import { Search, X } from 'lucide-react';
import { memo } from 'react';

const SearchBar = memo(({ query, setQuery, searchInputRef }) => {
    return (
        <div className='side-bar__search-container' onClick={() => searchInputRef.current.focus()}>
            <Search/>
            <input 
                placeholder='Search' 
                ref={searchInputRef} 
                className='side-bar__search' 
                onChange={(e) => setQuery(e.target.value)} 
                value={query}
            />
            {query && (
                <X size={24} onClick={() => setQuery('')} className='side-bar__search-close-button'/>
            )}
        </div>
    );
});

export default SearchBar