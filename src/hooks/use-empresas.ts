import { useCallback, useEffect, useState } from 'react';
import type { FilterOptions, Empresa } from '@/interfaces/empresas.interface';
import { fetchEmpresas } from '@/services/empresas.service';

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedEmpresas, setSelectedEmpresas] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFetchEmpresas = useCallback(
    async (refresh = false, newFilters?: FilterOptions) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters ?? filters;

        if (refresh || newFilters !== undefined) {
          setPage(1);
          setEmpresas([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchEmpresas(1, 10, currentFilters);
          setEmpresas(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          const response = await fetchEmpresas(page, 10, currentFilters);
          const newEmpresas = response.data.filter(
            (newEmpresa: Empresa) =>
              !empresas.some((existingEmpresa) => existingEmpresa.id === newEmpresa.id)
          );

          setEmpresas((prev) => [...prev, ...newEmpresas]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError('Error al cargar las empresas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, empresas, filters]
  );

  useEffect(() => {
    handleFetchEmpresas();
  }, []);

  const toggleEmpresaSelection = (empresaId: string) => {
    setSelectedEmpresas((prev) => {
      if (prev.includes(empresaId)) {
        return prev.filter((id) => id !== empresaId);
      } else {
        return [...prev, empresaId];
      }
    });
  };

  const selectAllEmpresas = () => {
    if (selectedEmpresas.length === empresas.length) {
      setSelectedEmpresas([]);
    } else {
      setSelectedEmpresas(empresas.map((empresa) => empresa.id));
    }
  };

  const clearSelections = () => {
    setSelectedEmpresas([]);
  };

  const refreshEmpresas = async () => {
    clearSelections();
    await handleFetchEmpresas(true);
  };

  const applyFilters = async (newFilters: FilterOptions) => {
    clearSelections();
    await handleFetchEmpresas(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchEmpresas(true, {});
  };

  return {
    empresas,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreEmpresas: handleFetchEmpresas,
    selectedEmpresas,
    toggleEmpresaSelection,
    selectAllEmpresas,
    refreshEmpresas,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected: empresas.length > 0 && selectedEmpresas.length === empresas.length,
  };
};