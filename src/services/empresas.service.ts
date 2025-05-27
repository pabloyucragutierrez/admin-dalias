import type {
  ApiResponse,
  PaginatedResponse,
  StatusDto,
} from "@/interfaces";
import type { FilterOptions, Empresa, EmpresaDto } from "@/interfaces/empresas.interface";
import api from "@/lib/api";

export const fetchEmpresas = async (
  page = 1,
  limit = 10,
  filterOptions?: FilterOptions
): Promise<PaginatedResponse<Empresa>> => {
  const response = await api.get<PaginatedResponse<Empresa>>(`/business`, {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const fetchEmpresaById = async (id: string): Promise<Empresa> => {
  const response = await api.get<Empresa>(`/business/${id}`);
  return response.data;
};

export const createEmpresas = async (payload: EmpresaDto) => {
  try {
    const response = await api.post(`/business`, payload);
    return response.data as ApiResponse<Empresa>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateEmpresas = async (id: string, payload: EmpresaDto) => {
  try {
    const response = await api.patch(`/business/${id}`, payload);
    return response.data as ApiResponse<Empresa>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const deleteEmpresas = async (id: string) => {
  try {
    const response = await api.delete(`/business/${id}`);
    return response.data as ApiResponse<null>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export async function activeOrInactiveEmpresas(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/business/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Empresa>;
  } catch (e) {
    console.log(e);
    throw e;
  }
}