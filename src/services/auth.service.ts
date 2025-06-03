import type { ApiResponse, LoginDto } from "@/interfaces";
import api from "@/lib/api";

export async function loginAPI(payload: {
  username: string;
  password: string;
}) {
  try {
    const response = await api.post("auth", payload);
    return response.data as ApiResponse<LoginDto>;
  } catch (e) {
    console.log(e);
  }
}
