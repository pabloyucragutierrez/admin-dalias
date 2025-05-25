export interface Categorias {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
}

export interface CategoriasDto {
  name: string;
}

export interface FilterOptionsCategorias {
  name?: string;
  status?: string;
}