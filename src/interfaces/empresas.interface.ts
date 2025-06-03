export interface Empresa {
  id: string;
  name: string;
  ruc: string;
  razonSocial: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface EmpresaDto {
  name: string;
  ruc: string;
  razonSocial: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
}

export interface FilterOptions {
  name?: string;
  ruc?: string;
  district?: string;
  state?: string; // Added to match the API 'state' parameter
}