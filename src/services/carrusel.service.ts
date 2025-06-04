import api from '@/lib/api';
import type { Banner } from '@/interfaces/carrusel.interface';

export const getBanners = async (): Promise<Banner[]> => {
  const response = await api.get<Banner[]>('/carrusel');
  return response.data;
};

export async function createBanner(payload: FormData): Promise<any> {
  try {
    const response = await api.post('/carrusel', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (e) {
    console.error("Error creando el carrusel:", e);
    throw e;
  }
}

export const deleteBanner = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/carrusel/${id}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};