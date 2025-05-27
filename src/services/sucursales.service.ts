import type {
  ApiResponse,
  PaginatedResponse,
  StatusDto,
} from "@/interfaces";
import type { FilterOptionsSucursales, Sucursales, SucursalesDto } from "@/interfaces/sucursales.interface";
import api from "@/lib/api";

const BUSINESS_ID = "5271c6b9-9280-4ca3-aef1-8543dce8dbe0";

export const fetchSucursales = async (
  page = 1,
  limit = 10,
  filterOptions?: FilterOptionsSucursales
): Promise<PaginatedResponse<Sucursales>> => {
  const response = await api.get<PaginatedResponse<Sucursales>>(`/sucursales/${BUSINESS_ID}`, {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const fetchSucursalById = async (id: string): Promise<Sucursales> => {
  const response = await api.get<Sucursales>(`/sucursales/byId/${id}`);
  return response.data;
};

export const createSucursales = async (payload: Omit<SucursalesDto, "businessId">) => {
  try {
    const response = await api.post(`/sucursales`, { ...payload, businessId: BUSINESS_ID });
    return response.data as ApiResponse<Sucursales>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateSucursales = async (id: string, payload: Omit<SucursalesDto, "businessId">) => {
  try {
    const response = await api.patch(`/sucursales/${id}`, { ...payload, businessId: BUSINESS_ID });
    return response.data as ApiResponse<Sucursales>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const deleteSucursales = async (id: string) => {
  try {
    const response = await api.delete(`/sucursales/${id}`);
    return response.data as ApiResponse<null>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export async function activeOrInactiveSucursales(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/sucursales/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Sucursales>;
  } catch (e) {
    console.log(e);
    throw e;
  }
}