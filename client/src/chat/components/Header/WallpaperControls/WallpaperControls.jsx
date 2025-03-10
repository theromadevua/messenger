const WallpaperControls = ({
    isBlurred,
    setIsBlurred,
    blackout,
    setBlackout,
    onSave
  }) => (
    <div className="media-window__select-params-container">
      <div className="media-window__select-params">
        <label>
          <input
            type="checkbox"
            checked={isBlurred}
            onChange={() => setIsBlurred(!isBlurred)}
          /> 
          <span>Blur Background</span>
        </label>
        <br/>
        <label className="media-window__range-label">
          <span>Blackout</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={blackout}
            onChange={(e) => setBlackout(e.target.value)}
          />
        </label>
      </div>
      <button className="media-window__button" onClick={e => {e.stopPropagation(); onSave()}}>
        Save
      </button>
    </div>
  );

  export default WallpaperControls 