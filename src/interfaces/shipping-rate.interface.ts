export interface ShippingRate {
  id: string;
  districtId: string;
  level: number;
  price: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: boolean;
  message?: string;
}