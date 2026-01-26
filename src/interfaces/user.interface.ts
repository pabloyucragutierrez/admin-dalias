export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
}