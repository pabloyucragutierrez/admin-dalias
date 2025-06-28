import type { ApiResponse, StatusDto } from "@/interfaces";
import type { Categorias, CategoriasDto } from "@/interfaces/categorias.interface";
import api from "@/lib/api";

export const fetchCategorias = async () => {
  const response = await api.get<Categorias[]>(`/categorias/actives`);
  return response.data;
};

export const fetchCategoriaById = async (id: string) => {
  const response = await api.get<Categorias>(`/categorias/${id}`);
  return response.data;
};

export const createCategorias = async (payload: CategoriasDto) => {
  try {
    // Only include subfamilia if it has non-empty values
    const cleanedPayload = {
      ...payload,
      familia: payload.familia.map(familia => ({
        ...familia,
        subfamilia: familia.subfamilia.length > 0 && familia.subfamilia.some(sf => sf.name.trim() !== "")
          ? familia.subfamilia
          : undefined
      }))
    };
    const response = await api.post(`/categorias`, cleanedPayload);
    return response.data as ApiResponse<Categorias>;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error desconocido al crear la categoría";
    throw new Error(errorMessage);
  }
};

export const updateCategorias = async (id: string, payload: CategoriasDto) => {
  try {
    // Only include subfamilia if it has non-empty values
    const cleanedPayload = {
      ...payload,
      familia: payload.familia.map(familia => ({
        ...familia,
        subfamilia: familia.subfamilia.length > 0 && familia.subfamilia.some(sf => sf.name.trim() !== "")
          ? familia.subfamilia
          : undefined
      }))
    };
    const response = await api.patch(`/categorias/${id}`, cleanedPayload);
    return response.data as ApiResponse<Categorias>;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error desconocido al actualizar la categoría";
    throw new Error(errorMessage);
  }
};

export async function activeOrInactiveCategorias(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/categorias/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Categorias>;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error desconocido al cambiar el estado de la categoría";
    throw new Error(errorMessage);
  }
}