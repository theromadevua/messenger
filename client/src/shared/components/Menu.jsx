import React, {useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import UIStore from '../../store/UIStore';


const useIsTop = (ref, y) => {
    const [isTop, setIsTop] = useState(null);
  
    if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const newIsTop = y <= (rect.top + rect.height / 4);
        if (isTop !== newIsTop) {
            setIsTop(newIsTop);
        }
    }

    return !isTop;
};

const Menu = observer(({ 
  items, 
  position, 
  reference,
  reverse = true,
  onClose,
  className = '',
  connected = false
}) => {
  const isTop = reference ? useIsTop(reference, position.y) : false;

  const style = !connected ? {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    transformOrigin: position.origin || 'top left',
    '--translateY': isTop ? '-100%' : '0%'
  } : {
    top: 'calc(100% + 10px)',
    transformOrigin: position.origin || 'top left',
  };

  useEffect(() => {
    if (reference?.current) {
      reference.current.style.overflow = 'hidden';
  
      return () => {
        if (reference.current) {
          reference.current.style.overflow = 'scroll';
        }
      };
    }
  }, [reference]);


    return (
        <div 
            style={style} 
            className={`menu ${isTop ? 'reverse-menu' : ''} ${className}`}
            onClick={e => e.stopPropagation()}
        >
            {items.filter((item) => item.condition).map((item, index) => {
                return (
                    item.condition !== false && (
                        <React.Fragment key={index}>
                        {index > 0 && <hr/>}
                        <div className="menu__item" onClick={() => {item.action(); UIStore.resetMenus()}}>
                            {item.icon}
                            {item.text}
                        </div>
                        </React.Fragment>
                )
            )})}
        </div>
    );
});

export default Menu;