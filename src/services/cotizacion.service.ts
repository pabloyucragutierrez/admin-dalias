import type { ApiResponse } from "@/interfaces";
import type { CotizacionPayload } from "@/interfaces/cotizacion.interface";
import api from "@/lib/api";

export const fetchCreateCotizacion = async (payload: CotizacionPayload) => {
  const response = await api.post<ApiResponse<any>>(`/cotizacion`, payload);
  return response.data;
};

export const fetchUpdateCotizacion = async (id: string, payload: CotizacionPayload) => {
  const response = await api.patch<ApiResponse<any>>(`/cotizacion/${id}`, payload);
  return response.data;
};

export async function getCotizacionById(id: string): Promise<any | null> {
  try {
    const response = await api.get(`/cotizacion/${id}`);
    return response.data as any;
  } catch (e) {
    console.error('Error fetching cotizacion:', e);
    return null;
  }
}