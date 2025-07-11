import type { Product } from "./products.interface";
import type { OptionSelect } from "./select.interface";


export interface FormManagementStockInputs {
  productId: OptionSelect | null;
  quantity: number;
  status: OptionSelect | null;
}

export interface ProductManagementStockDto {
  productId: string;
  quantity: number;
  status: string;
}

export interface ManagementStock {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  status: string;
  createAt: string;
}
