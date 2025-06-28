export interface Linea {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
}

export interface LineaDto {
  name: string;
}

export interface FilterOptions {
  name?: string;
  state?: string;
}