import type {
  ApiResponse,
  FilterOptionsUnidades,
  PaginatedResponse,
  StatusDto,
  Unidades,
  UnidadesDto,
} from "@/interfaces";
import api from "@/lib/api";

export const fetchUnidades = async (
  page = 1,
  limit = 10,
  filterOptions?: FilterOptionsUnidades
): Promise<PaginatedResponse<Unidades>> => {
  const response = await api.get<PaginatedResponse<Unidades>>(`/unidades`, {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const createUnidades = async (payload: UnidadesDto) => {
  try {
    const response = await api.post(`/unidades`, payload);
    return response.data as ApiResponse<Unidades>;
  } catch (e) {
    console.log(e);
  }
};

export const updateUnidades = async (id: string, payload: UnidadesDto) => {
  try {
    const response = await api.patch(`/unidades/${id}`, payload);
    return response.data as ApiResponse<Unidades>;
  } catch (e) {
    console.log(e);
  }
};

export async function activeOrinactiveUnidades(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(
      `unidades/inactivoOrActivo/${id}`,
      payload
    );
    return response.data as ApiResponse<Unidades>;
  } catch (e) {
    console.log(e);
  }
}
