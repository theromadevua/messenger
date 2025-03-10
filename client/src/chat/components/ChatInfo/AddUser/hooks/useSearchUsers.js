import { useState, useCallback, useEffect } from "react";
import UserStore from "../../../../../store/UserStore";

export const useSearchUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchUsers = useCallback(async (query) => {
      setIsLoading(true);
      try {
        await UserStore.searchUsers(query);
      } catch (error) {
        console.error('Error when looking for users:', error);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
        setUsers(UserStore.searchedUsers);
    }, [UserStore.searchedUsers]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                searchUsers(searchTerm);
            } else {
                UserStore.resetSearchedUsers();
                setUsers([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchUsers]);

    return { searchTerm, setSearchTerm, users, isLoading };
};
