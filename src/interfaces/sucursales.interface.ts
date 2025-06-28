export interface Almacen {
  id: string;
  sucursalId: string;
  quantityStands: number;
  flatsByStand: number;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

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
  Almacen: Almacen[];
}

export interface SucursalesDto {
  businessId: string;
  code: string;
  name: string;
  district: string;
  address: string;
  reference?: string;
  phone: string;
  quantityStands: number;
  flatsByStand: number;
}

export interface FilterOptionsSucursales {
  code?: string;
  name?: string;
  district?: string;
  state?: string;
}