import type { ApiResponse } from "@/interfaces";
import api from "@/lib/api";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
  };
}

export const loginAPI = async (
  credentials: LoginRequest
): Promise<ApiResponse<{ user: LoginResponse["user"]; token: string }>> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);

    return {
      success: true,
      data: {
        user: response.data.user,
        token: response.data.access_token,
      },
      message: "Inicio de sesión exitoso",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Error al iniciar sesión. Por favor, intente nuevamente.",
    };
  }
};