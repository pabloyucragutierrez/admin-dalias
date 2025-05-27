import { useCallback, useEffect, useState } from 'react';
import type { FilterOptions, User } from '@/interfaces/users.interface';
import { fetchUsers } from '@/services/users.service';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFetchUsers = useCallback(
    async (refresh = false, newFilters?: FilterOptions) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters ?? filters;

        if (refresh || newFilters !== undefined) {
          setPage(1);
          setUsers([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchUsers(1, 10, currentFilters);
          setUsers(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          const response = await fetchUsers(page, 10, currentFilters);
          const newUsers = response.data.filter(
            (newUser: User) => !users.some((existingUser) => existingUser.id === newUser.id)
          );

          setUsers((prev) => [...prev, ...newUsers]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError('Error al cargar los usuarios: ' + errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, users, filters]
  );

  useEffect(() => {
    handleFetchUsers();
  }, []);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const clearSelections = () => {
    setSelectedUsers([]);
  };

  const refreshUsers = async () => {
    clearSelections();
    await handleFetchUsers(true);
  };

  const applyFilters = async (newFilters: FilterOptions) => {
    clearSelections();
    await handleFetchUsers(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchUsers(true, {});
  };

  return {
    users,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreUsers: handleFetchUsers,
    selectedUsers,
    toggleUserSelection,
    selectAllUsers,
    refreshUsers,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected: users.length > 0 && selectedUsers.length === users.length,
  };
};