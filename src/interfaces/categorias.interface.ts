export interface Categorias {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
  fatherId: string | null;
}

export interface CategoriasDto {
  name: string;
  fatherId?: string | null;
}

export interface FilterOptionsCategorias {
  name?: string;
  state?: string;
}