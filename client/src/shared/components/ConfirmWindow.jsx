import React from 'react';

const ConfirmWindow = ({ isShow, func, children, rightButtonText = 'yes' }) => {
  return (
    <div className="confirm-window" onClick={() => isShow(false)}>
      <div className="confirm-window__content" onClick={e => e.stopPropagation()}>
        {children}
        <div className='confirm-window__buttons-container'>
            <button onClick={() => isShow(false)}>cancel</button>
            <button onClick={() => { func(); isShow(false); }}>{rightButtonText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmWindow;
