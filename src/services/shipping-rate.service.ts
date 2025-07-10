
import type { ApiResponse, ShippingRate } from '@/interfaces/shipping-rate.interface';
import api from "@/lib/api";

export async function getShippingRates(): Promise<ShippingRate[] | null> {
  try {
    const response = await api.get('/shipping-rate');
    return response.data as ShippingRate[];
  } catch (e) {
    console.error('Error fetching shipping rates:', e);
    return null;
  }
}

export async function getShippingRateById(id: string): Promise<ShippingRate | null> {
  try {
    const response = await api.get(`/shipping-rate/${id}`);
    return response.data as ShippingRate;
  } catch (e) {
    console.error('Error fetching shipping rate:', e);
    return null;
  }
}

export async function createShippingRate(payload: {
  districtId: string;
  level: number;
  price: number;
}): Promise<ApiResponse<ShippingRate> | null> {
  try {
    const response = await api.post('/shipping-rate', payload);
    return response.data as ApiResponse<ShippingRate>;
  } catch (e) {
    console.error('Error creating shipping rate:', e);
    return null;
  }
}

export async function updateShippingRate(
  id: string,
  payload: { districtId: string; level: number; price: number }
): Promise<ApiResponse<ShippingRate> | null> {
  try {
    const response = await api.patch(`/shipping-rate/${id}`, payload);
    return response.data as ApiResponse<ShippingRate>;
  } catch (e) {
    console.error('Error updating shipping rate:', e);
    return null;
  }
}

export async function deleteShippingRate(id: string): Promise<ApiResponse<ShippingRate> | null> {
  try {
    const response = await api.delete(`/shipping-rate/${id}`);
    return response.data as ApiResponse<ShippingRate>;
  } catch (e) {
    console.error('Error deleting shipping rate:', e);
    return null;
  }
}