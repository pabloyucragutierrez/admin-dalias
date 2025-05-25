import type {
  ApiResponse,
  PaginatedResponse,
  StatusDto
} from "@/interfaces";
import type { FilterOptionsRoles, Roles, RolesDto } from "@/interfaces/roles.interface";
import api from "@/lib/api";

export const fetchRoles = async (
  page = 1,
  limit = 10,
  filterOptions?: FilterOptionsRoles
): Promise<PaginatedResponse<Roles>> => {
  const response = await api.get<PaginatedResponse<Roles>>(`/roles`, {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const createRoles = async (payload: RolesDto) => {
  try {
    const response = await api.post(`/roles`, payload);
    return response.data as ApiResponse<Roles>;
  } catch (e) {
    console.log(e);
  }
};

export const updateRoles = async (id: string, payload: RolesDto) => {
  try {
    const response = await api.patch(`/roles/${id}`, payload);
    return response.data as ApiResponse<Roles>;
  } catch (e) {
    console.log(e);
  }
};

export async function activeOrInactiveRoles(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/roles/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Roles>;
  } catch (e) {
    console.log(e);
  }
}