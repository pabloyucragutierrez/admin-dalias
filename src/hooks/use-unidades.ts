import type { FilterOptionsUnidades, Unidades } from "@/interfaces";
import { fetchUnidades } from "@/services/unidades.service";

import { useCallback, useEffect, useState } from "react";

export const useUnidades = () => {
  const [unidades, setUnidades] = useState<Unidades[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedUnidades, setSelectedUnidades] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptionsUnidades>({});

  const handleFetchUnidades = useCallback(
    async (refresh = false, newFilters?: FilterOptionsUnidades) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);

        // Si hay nuevos filtros, actualizamos el estado
        const currentFilters = newFilters !== undefined ? newFilters : filters;

        // Si es refresh o nuevos filtros, reseteamos el estado
        if (refresh || newFilters !== undefined) {
          setPage(1);
          setUnidades([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchUnidades(1, 10, currentFilters);
          setUnidades(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          // Carga normal de más candidatos
          const response = await fetchUnidades(page, 10, currentFilters);

          // Verificar si hay candidatos duplicados antes de actualizar el estado
          const newUnidades = response.data.filter(
            (newUnidad) =>
              !unidades.some(
                (existingUnidad) => existingUnidad.id === newUnidad.id
              )
          );

          setUnidades((prev) => [...prev, ...newUnidades]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError("Error al cargar los candidatos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, unidades, filters]
  );

  // Cargar candidatos iniciales
  useEffect(() => {
    handleFetchUnidades();
  }, []);

  const toggleUnidadSelection = (candidateId: string) => {
    setSelectedUnidades((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  const selectAllUnidades = () => {
    if (selectedUnidades.length === unidades.length) {
      setSelectedUnidades([]);
    } else {
      setSelectedUnidades(unidades.map((unidad) => unidad.id));
    }
  };

  const clearSelections = () => {
    setSelectedUnidades([]);
  };

  const refreshUnidades = async () => {
    clearSelections();
    await handleFetchUnidades(true);
  };

  const applyFilters = async (newFilters: FilterOptionsUnidades) => {
    clearSelections();
    await handleFetchUnidades(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchUnidades(true, {});
  };

  return {
    unidades,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreUnidades: fetchUnidades,
    selectedUnidades,
    toggleUnidadSelection,
    selectAllUnidades,
    refreshUnidades,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected:
      unidades.length > 0 && selectedUnidades.length === unidades.length,
  };
};
