import type { ApiResponse } from "@/interfaces";
import type { Banco } from "@/interfaces/bancos.interface";
import api from "@/lib/api";

export async function getBancoById(id: string): Promise<Banco | null> {
  try {
    const response = await api.get(`/banks/${id}`);
    return response.data as Banco;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error al obtener el banco";
    throw new Error(errorMessage);
  }
}

export async function createBanco(payload: FormData): Promise<ApiResponse<Banco>> {
  try {
    const response = await api.post("/banks", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as ApiResponse<Banco>;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error al crear el banco";
    throw new Error(errorMessage);
  }
}

export async function updateBanco(id: string, payload: FormData): Promise<ApiResponse<Banco>> {
  try {
    const response = await api.patch(`/banks/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as ApiResponse<Banco>;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error al actualizar el banco";
    throw new Error(errorMessage);
  }
}

export async function deleteBanco(id: string): Promise<ApiResponse<Banco>> {
  try {
    const response = await api.delete(`/banks/${id}`);
    return response.data as ApiResponse<Banco>;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Error al eliminar el banco";
    throw new Error(errorMessage);
  }
}