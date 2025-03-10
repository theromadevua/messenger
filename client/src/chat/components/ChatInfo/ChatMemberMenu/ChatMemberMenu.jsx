import React, { memo } from "react";
import ChatStore from "../../../../store/chat/ChatStore";
import Menu from "../../../../shared/components/Menu";

export const ChatMemberMenu = memo(({member, position}) => {
    
    const menuItems = [
        {
            condition: ChatStore.state.isOwner && member?.role === 'MEMBER',
            action: () => ChatStore.assignAdmin(member),
            icon: <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            text: 'assign admin'
        },
        {
            condition: ChatStore.state.isOwner && member?.role === 'ADMIN',
            action: () => ChatStore.dismissAdmin(member),
            icon: <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="17" y1="8" x2="22" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="22" y1="8" x2="16" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
            text: 'dismiss admin'
        },
        {
            condition: (ChatStore.state.isOwner || ChatStore.state.isAdmin) && member?.role !== 'OWNER',
            icon: <svg width="24" height="24" viewBox="0 1 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            text: 'delete member'
        }
    ];

    return (
        <Menu
            items={menuItems}
            position={{ 
            x: position.x, 
            y: position.y,
            origin: 'top left'
            }}
            reference={null}
            className="menu"
        />
    );
});
