import type { ApiResponse } from "@/interfaces";
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