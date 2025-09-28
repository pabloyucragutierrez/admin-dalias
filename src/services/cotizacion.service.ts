import type { ApiResponse } from "@/interfaces";
import type { Cotizacion, CotizacionPayload } from "@/interfaces/cotizacion.interface";
import api from "@/lib/api";

export const fetchCreateCotizacion = async (payload: CotizacionPayload) => {
  const response = await api.post<ApiResponse<any>>(`/cotizacion`, payload);
  return response.data;
};

export const fetchUpdateCotizacion = async (id: string, payload: CotizacionPayload) => {
  const response = await api.patch<ApiResponse<any>>(`/cotizacion/${id}`, payload);
  return response.data;
};

export async function getCotizacionById(id: string): Promise<Cotizacion | null> {
  try {
    const response = await api.get(`/cotizacion/${id}`);
    return response.data as Cotizacion;
  } catch (e) {
    console.error('Error fetching cotizacion:', e);
    return null;
  }
}

export const downloadCotizacionPdf = async (id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/cotizacion/${id}/pdf-make`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};