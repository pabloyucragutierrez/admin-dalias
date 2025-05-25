import { useCallback, useEffect, useState } from 'react';
import { fetchRoles } from '@/services/roles.service';
import type { FilterOptionsRoles, Roles } from '@/interfaces/roles.interface';

export const useRoles = () => {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptionsRoles>({});

  const handleFetchRoles = useCallback(
    async (refresh = false, newFilters?: FilterOptionsRoles) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters !== undefined ? newFilters : filters;

        if (refresh || newFilters !== undefined) {
          setPage(1);
          setRoles([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchRoles(1, 10, currentFilters);
          setRoles(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          const response = await fetchRoles(page, 10, currentFilters);
          const newRoles = response.data.filter(
            (newRol: Roles) =>
              !roles.some((existingRol) => existingRol.id === newRol.id)
          );

          setRoles((prev) => [...prev, ...newRoles]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError('Error al cargar los roles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, roles, filters]
  );

  useEffect(() => {
    handleFetchRoles();
  }, []);

  const toggleRolSelection = (rolId: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(rolId)) {
        return prev.filter((id) => id !== rolId);
      } else {
        return [...prev, rolId];
      }
    });
  };

  const selectAllRoles = () => {
    if (selectedRoles.length === roles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles.map((rol) => rol.id));
    }
  };

  const clearSelections = () => {
    setSelectedRoles([]);
  };

  const refreshRoles = async () => {
    clearSelections();
    await handleFetchRoles(true);
  };

  const applyFilters = async (newFilters: FilterOptionsRoles) => {
    clearSelections();
    await handleFetchRoles(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchRoles(true, {});
  };

  return {
    roles,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreRoles: fetchRoles,
    selectedRoles,
    toggleRolSelection,
    selectAllRoles,
    refreshRoles,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected: roles.length > 0 && selectedRoles.length === roles.length,
  };
};