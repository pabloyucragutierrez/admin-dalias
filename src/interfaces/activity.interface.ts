export interface Activity {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagen: string;
  imagePublicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityPayload {
  titulo: string;
  subtitulo?: string;
  descripcion: string;
  imagen?: File;
}