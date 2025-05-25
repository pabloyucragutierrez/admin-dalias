export interface Marcas {
  id: string;
  code: string;
  name: string;
  status: boolean;
  createAt: string;
}

export interface MarcasDto {
  code: string;
  name: string;
}

export interface FilterOptionsMarcas {
  name?: string;
  code?: string;
  status?: string;
}