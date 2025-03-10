import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

const messageTypes = {
    chat_created: data => (
        <>Chat was created by <NavLink to={`/user/${data.owner._id}`}>@{data.owner.username}</NavLink></>
    ),
    user_adding: data => (
        <><NavLink to={`/user/${data.new_member._id}`}>@{data.new_member.username}</NavLink> was added by <NavLink to={`/user/${data.inviter._id}`}>@{data.inviter.username}</NavLink></>
    ),
    user_join: data => (
        <><NavLink to={`/user/${data.new_member._id}`}>@{data.new_member.username}</NavLink> joined chat</>
    )
};

const SystemMessage = memo(({ metadata }) => (
    <div className="system-message">
        {messageTypes[metadata.action]?.(metadata.data)}
    </div>
));

export default SystemMessage