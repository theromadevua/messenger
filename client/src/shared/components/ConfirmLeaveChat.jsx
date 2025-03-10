import React from 'react';
import ConfirmWindow from './ConfirmWindow';

const ConfirmLeaveChat = ({ isShow, onConfirm }) => {
    return (
        <ConfirmWindow func={onConfirm} isShow={isShow} rightButtonText="yes">
            <h3>Are you sure you want to leave this chat?</h3>
        </ConfirmWindow>
    );
};

export default ConfirmLeaveChat;