import type { ApiResponse, PaginatedResponse, StatusDto } from '@/interfaces';
import type { FilterOptions, User, UserDto, Role } from '@/interfaces/users.interface';
import api from '@/lib/api';

export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  filterOptions?: FilterOptions
): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>('/users', {
    params: { page, limit, ...filterOptions },
  });
  return response.data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUsers = async (payload: UserDto) => {
  try {
    const response = await api.post('/users', payload);
    return response.data as ApiResponse<User>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateUsers = async (id: string, payload: UserDto) => {
  try {
    const response = await api.patch(`/users/${id}`, payload);
    return response.data as ApiResponse<User>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const deleteUsers = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data as ApiResponse<null>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export async function activeOrInactiveUsers(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/users/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<User>;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const fetchActiveRoles = async (): Promise<Role[]> => {
  const response = await api.get<Role[]>('/roles/actives');
  return response.data;
};