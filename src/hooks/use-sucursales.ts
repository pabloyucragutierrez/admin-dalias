import { useCallback, useEffect, useState } from 'react';
import { fetchSucursales } from '@/services/sucursales.service';
import type { FilterOptionsSucursales, Sucursales } from '@/interfaces/sucursales.interface';

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursales[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptionsSucursales>({});

  const handleFetchSucursales = useCallback(
    async (refresh = false, newFilters?: FilterOptionsSucursales) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters !== undefined ? newFilters : filters;

        if (refresh || newFilters !== undefined) {
          setPage(1);
          setSucursales([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchSucursales(1, 10, currentFilters);
          setSucursales(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          const response = await fetchSucursales(page, 10, currentFilters);
          const newSucursales = response.data.filter(
            (newSucursal: Sucursales) =>
              !sucursales.some((existingSucursal) => existingSucursal.id === newSucursal.id)
          );

          setSucursales((prev) => [...prev, ...newSucursales]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError('Error al cargar las sucursales');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, sucursales, filters]
  );

  useEffect(() => {
    handleFetchSucursales();
  }, []);

  const toggleSucursalSelection = (sucursalId: string) => {
    setSelectedSucursales((prev) => {
      if (prev.includes(sucursalId)) {
        return prev.filter((id) => id !== sucursalId);
      } else {
        return [...prev, sucursalId];
      }
    });
  };

  const selectAllSucursales = () => {
    if (selectedSucursales.length === sucursales.length) {
      setSelectedSucursales([]);
    } else {
      setSelectedSucursales(sucursales.map((sucursal) => sucursal.id));
    }
  };

  const clearSelections = () => {
    setSelectedSucursales([]);
  };

  const refreshSucursales = async () => {
    clearSelections();
    await handleFetchSucursales(true);
  };

  const applyFilters = async (newFilters: FilterOptionsSucursales) => {
    clearSelections();
    await handleFetchSucursales(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchSucursales(true, {});
  };

  return {
    sucursales,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreSucursales: fetchSucursales,
    selectedSucursales,
    toggleSucursalSelection,
    selectAllSucursales,
    refreshSucursales,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected: sucursales.length > 0 && selectedSucursales.length === sucursales.length,
  };
};