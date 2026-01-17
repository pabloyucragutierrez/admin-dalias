export interface Blog {
  id: number;
  titulo: string;
  descripcionCorta: string;
  descripcion: string;
  imagen: string;
  imagePublicId: string;
  estado: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
  };
}

export interface BlogPayload {
  titulo: string;
  descripcionCorta: string;
  descripcion: string;
  imagen?: File;
}