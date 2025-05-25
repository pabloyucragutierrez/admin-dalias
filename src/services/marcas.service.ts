import type {
  ApiResponse,
  PaginatedResponse,
  StatusDto
} from "@/interfaces";
import type { FilterOptionsMarcas, Marcas, MarcasDto } from "@/interfaces/marcas.interface";
import api from "@/lib/api";

export const fetchMarcas = async (
  page = 1,
  limit = 10,
  filterOptions?: FilterOptionsMarcas
): Promise<PaginatedResponse<Marcas>> => {
  const response = await api.get<PaginatedResponse<Marcas>>(`/marcas`, {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const createMarcas = async (payload: MarcasDto) => {
  try {
    const response = await api.post(`/marcas`, payload);
    return response.data as ApiResponse<Marcas>;
  } catch (e) {
    console.log(e);
  }
};

export const updateMarcas = async (id: string, payload: MarcasDto) => {
  try {
    const response = await api.patch(`/marcas/${id}`, payload);
    return response.data as ApiResponse<Marcas>;
  } catch (e) {
    console.log(e);
  }
};

export async function activeOrInactiveMarcas(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/marcas/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Marcas>;
  } catch (e) {
    console.log(e);
  }
}