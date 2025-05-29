export interface Sucursales {
  id: string;
  businessId: string;
  code: string;
  name: string;
  district: string;
  address: string;
  reference?: string;
  phone: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface SucursalesDto {
  businessId: string;
  code: string;
  name: string;
  district: string;
  address: string;
  reference?: string;
  phone: string;
}

export interface FilterOptionsSucursales {
  code?: string;
  name?: string;
  district?: string;
  state?: string;
}