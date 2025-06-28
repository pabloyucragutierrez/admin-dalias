import type {
  ApiResponse,
  PaginatedResponse,
  StatusDto,
} from "@/interfaces";
import type { FilterOptions, Linea, LineaDto } from "@/interfaces/lineas.interface";
import api from "@/lib/api";

export const fetchLineas = async (
  page = 1,
  limit = 10,
  filterOptions?: FilterOptions
): Promise<PaginatedResponse<Linea>> => {
  const response = await api.get<PaginatedResponse<Linea>>(`/lineas`, {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const fetchActiveLineas = async (): Promise<Linea[]> => {
  const response = await api.get<Linea[]>(`/lineas/actives`);
  return response.data;
};

export const fetchLineaById = async (id: string): Promise<Linea> => {
  const response = await api.get<Linea>(`/lineas/${id}`);
  return response.data;
};

export const createLineas = async (payload: LineaDto) => {
  try {
    const response = await api.post(`/lineas`, payload);
    return response.data as ApiResponse<Linea>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateLineas = async (id: string, payload: LineaDto) => {
  try {
    const response = await api.patch(`/lineas/${id}`, payload);
    return response.data as ApiResponse<Linea>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export async function activeOrInactiveLineas(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/lineas/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Linea>;
  } catch (e) {
    console.log(e);
    throw e;
  }
}