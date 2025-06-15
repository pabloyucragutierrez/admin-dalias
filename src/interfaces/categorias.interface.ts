export interface Categorias {
  id: string;
  linea: string | null;
  name: string;
  status: boolean;
  createAt: string;
  updatedAt: string;
  fatherId: string | null;
  children: {
    id: string;
    linea: string | null;
    name: string;
    fatherId: string;
    status: boolean;
    createAt: string;
    updatedAt: string;
    children: {
      id: string;
      linea: string | null;
      name: string;
      fatherId: string;
      status: boolean;
      createAt: string;
      updatedAt: string;
    }[];
  }[];
}

export interface CategoriasDto {
  linea: string;
  name: string;
  familia: {
    name: string;
    id: string;
    subfamilia: { name: string; id: string }[];
  }[];
}

export interface FilterOptionsCategorias {
  name?: string;
  state?: string;
}