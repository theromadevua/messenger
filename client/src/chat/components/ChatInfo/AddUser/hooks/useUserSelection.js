import { useState } from "react";
import { avatarColors } from "../../../../../hooks/useUserColor";

export const useUserSelection = (users, chatMembers) => {
    const [selectedUser, setSelectedUser] = useState('');

    const isUserMember = (user) => chatMembers.some((member) => member.user._id === user._id);

    const toggleUserSelection = (user) => {
        if (!isUserMember(user)) {
            setSelectedUser((prev) => (prev === user._id ? '' : user._id));
        }
    };

    const getUserAvatar = (user) => {
        if (user.avatar?.url) {
            return user.avatar.url;
        }
        const numberFromId = user._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return avatarColors[numberFromId % avatarColors.length];
    };

    return { selectedUser, toggleUserSelection, isUserMember, getUserAvatar };
};
