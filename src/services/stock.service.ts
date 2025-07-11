
import type { ApiResponse } from "@/interfaces";
import type { ProductManagementStockDto } from "@/interfaces/management-stock.interface";
import api from "@/lib/api";

export async function createStock(payload: ProductManagementStockDto) {
  try {
    const response = await api.post("management-stock", payload);
    return response.data as ApiResponse<any>;
  } catch (e) {
    console.log(e);
  }
}
