import { useCallback, useEffect, useState } from 'react';
import { fetchSucursales } from '@/services/sucursales.service';
import type { FilterOptionsSucursales, Sucursales } from '@/interfaces/sucursales.interface';

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursales[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptionsSucursales>({});

  const handleFetchSucursales = useCallback(
    async (refresh = false, newFilters?: FilterOptionsSucursales) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters ?? filters;

        if (refresh || newFilters) {
          setSucursales([]);
          if (newFilters) {
            setFilters(newFilters);
          }
        }

        const response = await fetchSucursales(currentFilters);
        setSucursales(response.data); // Extraemos solo el array 'data'
        setError(null);
      } catch (err) {
        setError('Error al cargar las sucursales');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters] // Eliminamos 'loading' de las dependencias para evitar bucles
  );

  useEffect(() => {
    handleFetchSucursales(true); // Carga inicial con refresh
  }, [handleFetchSucursales]);

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
    hasMore: false, // Sin paginación
    filters,
    fetchMoreSucursales: () => Promise.resolve(), // No-op, sin paginación
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