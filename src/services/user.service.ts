import type { User, UserPayload, UpdateUserPayload } from "@/interfaces/user.interface";
import api from "@/lib/api";

export async function getUsers(): Promise<User[]> {
  try {
    const response = await api.get("/users");
    return response.data as User[];
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data as User;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function createUser(payload: UserPayload) {
  try {
    const response = await api.post("/users/register", payload);

    return {
      success: true,
      message: "Usuario creado correctamente",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear usuario",
    };
  }
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  try {
    const response = await api.patch(`/users/${id}`, payload);

    return {
      success: true,
      message: "Usuario actualizado correctamente",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al actualizar usuario",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    await api.delete(`/users/${id}`);

    return {
      success: true,
      message: "Usuario eliminado correctamente",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al eliminar usuario",
    };
  }
}