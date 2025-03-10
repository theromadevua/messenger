import { observer } from 'mobx-react';
import ConfirmWindow from '../../../../shared/components/ConfirmWindow';
import SetWallpapersWindow from '../SetWallpapersWindow/SetWallpapersWindow';
import HeaderContainer from '../HeaderContainer';
import useHeaderLogic from './hooks/useHeaderLogic';
import UserStore from '../../../../store/UserStore';

const Header = observer(() => {
    const {
        showConfirmWindow,
        setShowConfirmWindow,
        handleBack,
        handleLeaveChat,
        handleMenuClick,
    } = useHeaderLogic();
    
    return (
        <div className='header'>
            {showConfirmWindow && (
                <ConfirmWindow 
                    func={handleLeaveChat} 
                    isShow={setShowConfirmWindow} 
                    rightButtonText={'yes'}
                >
                    <h3>Are you sure you want to leave this chat?</h3>
                </ConfirmWindow>
            )}
            <SetWallpapersWindow 
                handleMenuClick={handleMenuClick} 
                setShowConfirmWindow={setShowConfirmWindow} 
            />
            <HeaderContainer 
                handleBack={handleBack} 
                handleMenuClick={handleMenuClick} 
                setShowConfirmWindow={setShowConfirmWindow} 
            />
        </div>
    );
});

export default Header;
