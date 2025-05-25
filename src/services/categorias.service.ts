import type {
  ApiResponse,
  PaginatedResponse,
  StatusDto
} from "@/interfaces";
import type { Categorias, CategoriasDto, FilterOptionsCategorias } from "@/interfaces/categorias.interface";
import api from "@/lib/api";

export const fetchCategorias = async (
  page = 1,
  limit = 10,
  filterOptions?: FilterOptionsCategorias
): Promise<PaginatedResponse<Categorias>> => {
  const response = await api.get<PaginatedResponse<Categorias>>(`/categorias`, {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const createCategorias = async (payload: CategoriasDto) => {
  try {
    const response = await api.post(`/categorias`, payload);
    return response.data as ApiResponse<Categorias>;
  } catch (e) {
    console.log(e);
  }
};

export const updateCategorias = async (id: string, payload: CategoriasDto) => {
  try {
    const response = await api.patch(`/categorias/${id}`, payload);
    return response.data as ApiResponse<Categorias>;
  } catch (e) {
    console.log(e);
  }
};

export async function activeOrInactiveCategorias(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/categorias/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Categorias>;
  } catch (e) {
    console.log(e);
  }
}