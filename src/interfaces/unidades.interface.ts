export interface Unidades {
  id: string;
  code: string;
  name: string;
  status: boolean;
  createAt: string;
}

export interface UnidadesDto {
  name: string;
  code: string;
}

export interface FilterOptionsUnidades {
  name?: string;
  status?: string;
}
