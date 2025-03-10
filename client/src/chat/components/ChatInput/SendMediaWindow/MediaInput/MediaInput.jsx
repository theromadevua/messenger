const MediaInput = ({ text, setText, handleSubmit, closeWindow }) => (
    <div className='media-window__input-container'>
        <input
            className='media-window__input'
            type="text"
            value={text}
            placeholder='Write a message'
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                    closeWindow();
                }
            }}
        />
        <button
            className='media-window__button'
            onClick={e => {
                e.stopPropagation();
                handleSubmit();
                closeWindow();
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <g transform="rotate(45, 12, 12) translate(-3, 3)">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </g>
            </svg>
        </button>
    </div>
);

export default MediaInput;