import api from '@/lib/api'; 
import type { Banner } from '@/interfaces/banner.interface'; 

export const getBanners = async (): Promise<Banner[]> => {
  const response = await api.get<Banner[]>('/banners');
  return response.data;
};

export async function createBanner(payload: FormData): Promise<any> {
  const response = await api.post('/banners', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export const deleteBanner = async (id: string): Promise<any> => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};

export async function updateBanner(id: string, payload: FormData): Promise<any> {
  const response = await api.patch(`/banners/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}