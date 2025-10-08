import type { ApiResponse, StatusDto } from "@/interfaces";
import type { Cliente, ClientManagementPayload } from "@/interfaces/client.interface";
import api from "@/lib/api";

export const fetchCreateClient = async (payload: ClientManagementPayload) => {
  const response = await api.post<ApiResponse<any>>(`/clients`, payload);
  return response.data;
};

export const fetchUpdateClient = async (id: string, payload: ClientManagementPayload) => {
  const response = await api.patch<ApiResponse<any>>(`/clients/${id}`, payload);
  return response.data;
};

export const fetchClientActiveList = async (): Promise<Cliente[]> => {
  const response = await api.get<Cliente[]>(`/clients/actives`);
  return response.data;
};


export async function getClientById(id: string): Promise<Cliente | null> {
  try {
    const response = await api.get(`/clients/${id}`);
    return response.data as Cliente;
  } catch (e) {
    console.error('Error fetching client:', e);
    return null;
  }
}

export async function activeOrInactiveClientes(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/clients/inactivoOrActivo/${id}`, payload);
    return response.data as ApiResponse<Cliente>;
  } catch (e) {
    console.log(e);
  }
}

export async function activeOrInactiveClientesPrivate(id: string, payload: StatusDto) {
  try {
    const response = await api.patch(`/clients/inactivoOrActivoPrivate/${id}`, payload);
    return response.data as ApiResponse<Cliente>;
  } catch (e) {
    console.log(e);
  }
}